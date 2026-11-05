import { NextRequest, NextResponse } from "next/server";
import { db, savedPosts, posts } from "@/db";
import { eq, and } from "drizzle-orm";
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

    const existing = await db.query.savedPosts.findFirst({
      where: and(eq(savedPosts.userId, currentUser.id), eq(savedPosts.postId, postId)),
    });

    if (existing) {
      await db
        .delete(savedPosts)
        .where(and(eq(savedPosts.userId, currentUser.id), eq(savedPosts.postId, postId)));

      return NextResponse.json({
        success: true,
        data: { saved: false, message: "Removed from saved reports" },
      });
    }

    await db.insert(savedPosts).values({
      userId: currentUser.id,
      postId,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: { saved: true, message: "Report saved to bookmarks" },
    });
  } catch (error) {
    console.error("POST /api/posts/[id]/save error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle bookmark" },
      { status: 500 }
    );
  }
}
