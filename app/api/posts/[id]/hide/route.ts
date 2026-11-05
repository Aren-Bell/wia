import { NextRequest, NextResponse } from "next/server";
import { db, hiddenPosts, posts } from "@/db";
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
      where: eq(posts.id, postId),
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const existing = await db.query.hiddenPosts.findFirst({
      where: and(eq(hiddenPosts.userId, currentUser.id), eq(hiddenPosts.postId, postId)),
    });

    if (!existing) {
      await db.insert(hiddenPosts).values({
        userId: currentUser.id,
        postId,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Post hidden from your feed",
    });
  } catch (error) {
    console.error("POST /api/posts/[id]/hide error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to hide post" },
      { status: 500 }
    );
  }
}
