import { NextRequest, NextResponse } from "next/server";
import { db, comments, posts } from "@/db";
import { eq, sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-helper";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const currentUser = await getSessionUser(req);

    const comment = await db.query.comments.findFirst({
      where: eq(comments.id, id),
    });

    if (!comment || comment.isDeleted) {
      return NextResponse.json(
        { success: false, error: "Comment not found or already deleted" },
        { status: 404 }
      );
    }

    const isAuthor = comment.authorId === currentUser.id;
    const isInternal = currentUser.role === "INTERNAL";

    if (!isAuthor && !isInternal) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: You cannot delete this comment" },
        { status: 403 }
      );
    }

    // Soft delete
    await db
      .update(comments)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(comments.id, id));

    // Decrement post comments count
    await db
      .update(posts)
      .set({ commentsCount: sql`MAX(${posts.commentsCount} - 1, 0)` })
      .where(eq(posts.id, comment.postId));

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/comments/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
