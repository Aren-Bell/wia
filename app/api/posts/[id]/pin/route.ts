import { NextRequest, NextResponse } from "next/server";
import { db, posts } from "@/db";
import { eq, and } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-helper";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: postId } = await params;
    const currentUser = await getSessionUser(req);

    if (currentUser.role !== "GOVERNMENT" && currentUser.role !== "INTERNAL") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only Government or Internal team can pin reports." },
        { status: 403 }
      );
    }

    const post = await db.query.posts.findFirst({
      where: and(eq(posts.id, postId), eq(posts.isDeleted, false)),
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found or deleted" },
        { status: 404 }
      );
    }

    const newPinnedStatus = !post.isPinned;
    await db
      .update(posts)
      .set({ isPinned: newPinnedStatus, updatedAt: new Date() })
      .where(eq(posts.id, postId));

    return NextResponse.json({
      success: true,
      data: {
        postId,
        isPinned: newPinnedStatus,
        message: newPinnedStatus ? "Report pinned to the top of feed" : "Report unpinned",
      },
    });
  } catch (error) {
    console.error("POST /api/posts/[id]/pin error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle pin" },
      { status: 500 }
    );
  }
}
