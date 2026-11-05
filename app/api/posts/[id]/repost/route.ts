import { NextRequest, NextResponse } from "next/server";
import { db, reposts, posts } from "@/db";
import { eq, and, sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-helper";
import {
  acquireActionLock,
  getCachedUserRepost,
  setCachedUserRepost,
  setCachedPostCounters,
} from "@/lib/redis";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: postId } = await params;
    const currentUser = await getSessionUser(req);

    // Anti-spam lock in Redis (300ms window)
    const lockAcquired = await acquireActionLock(`repost:${currentUser.id}:${postId}`, 300);
    if (!lockAcquired) {
      return NextResponse.json(
        { success: false, error: "Please wait a moment before reposting again" },
        { status: 429 }
      );
    }

    const post = await db.query.posts.findFirst({
      where: and(eq(posts.id, postId), eq(posts.isDeleted, false)),
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    let hasReposted = await getCachedUserRepost(currentUser.id, postId);
    if (hasReposted === null) {
      const existing = await db.query.reposts.findFirst({
        where: and(eq(reposts.userId, currentUser.id), eq(reposts.postId, postId)),
      });
      hasReposted = Boolean(existing);
    }

    let finalCount = post.repostsCount;

    if (hasReposted) {
      await db
        .delete(reposts)
        .where(and(eq(reposts.userId, currentUser.id), eq(reposts.postId, postId)));

      await db
        .update(posts)
        .set({ repostsCount: sql`MAX(${posts.repostsCount} - 1, 0)` })
        .where(eq(posts.id, postId));

      finalCount = Math.max(post.repostsCount - 1, 0);

      await Promise.all([
        setCachedUserRepost(currentUser.id, postId, false),
        setCachedPostCounters(postId, {
          upvotesCount: post.upvotesCount,
          downvotesCount: post.downvotesCount,
          repostsCount: finalCount,
        }),
      ]);

      return NextResponse.json({
        success: true,
        data: { reposted: false, repostsCount: finalCount },
      });
    }

    await db.insert(reposts).values({
      userId: currentUser.id,
      postId,
      createdAt: new Date(),
    });

    await db
      .update(posts)
      .set({ repostsCount: sql`${posts.repostsCount} + 1` })
      .where(eq(posts.id, postId));

    finalCount = post.repostsCount + 1;

    await Promise.all([
      setCachedUserRepost(currentUser.id, postId, true),
      setCachedPostCounters(postId, {
        upvotesCount: post.upvotesCount,
        downvotesCount: post.downvotesCount,
        repostsCount: finalCount,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: { reposted: true, repostsCount: finalCount },
    });
  } catch (error) {
    console.error("POST /api/posts/[id]/repost error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle repost" },
      { status: 500 }
    );
  }
}
