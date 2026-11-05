import { NextRequest, NextResponse } from "next/server";
import { db, reposts, posts } from "@/db";
import { eq, and, sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-helper";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: postId } = await params;
    const currentUser = await getSessionUser(req);

    const post = await db.query.posts.findFirst({
      where: and(eq(posts.id, postId), eq(posts.isDeleted, false)),
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const existing = await db.query.reposts.findFirst({
      where: and(eq(reposts.userId, currentUser.id), eq(reposts.postId, postId)),
    });

    if (existing) {
      await db
        .delete(reposts)
        .where(and(eq(reposts.userId, currentUser.id), eq(reposts.postId, postId)));

      await db
        .update(posts)
        .set({ repostsCount: sql`MAX(${posts.repostsCount} - 1, 0)` })
        .where(eq(posts.id, postId));

      return NextResponse.json({
        success: true,
        data: { reposted: false, repostsCount: Math.max(post.repostsCount - 1, 0) },
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

    return NextResponse.json({
      success: true,
      data: { reposted: true, repostsCount: post.repostsCount + 1 },
    });
  } catch (error) {
    console.error("POST /api/posts/[id]/repost error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle repost" },
      { status: 500 }
    );
  }
}
