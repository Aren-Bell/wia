import { NextRequest, NextResponse } from "next/server";
import { db, comments, votes, notifications } from "@/db";
import { eq, and, sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-helper";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: commentId } = await params;
    const currentUser = await getSessionUser(req);
    const body = await req.json();

    const voteType = body?.voteType?.toUpperCase();
    if (voteType !== "UP" && voteType !== "DOWN") {
      return NextResponse.json(
        { success: false, error: "voteType must be 'UP' or 'DOWN'" },
        { status: 400 }
      );
    }

    const targetComment = await db.query.comments.findFirst({
      where: and(eq(comments.id, commentId), eq(comments.isDeleted, false)),
    });

    if (!targetComment) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    // Check existing vote
    const existingVote = await db.query.votes.findFirst({
      where: and(
        eq(votes.userId, currentUser.id),
        eq(votes.targetType, "COMMENT"),
        eq(votes.targetId, commentId)
      ),
    });

    let action: "ADDED" | "SWITCHED" | "REMOVED";
    let currentVote: "UP" | "DOWN" | null = null;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Cancel vote
        await db
          .delete(votes)
          .where(
            and(
              eq(votes.userId, currentUser.id),
              eq(votes.targetType, "COMMENT"),
              eq(votes.targetId, commentId)
            )
          );

        if (voteType === "UP") {
          await db
            .update(comments)
            .set({ upvotesCount: sql`MAX(${comments.upvotesCount} - 1, 0)` })
            .where(eq(comments.id, commentId));
        } else {
          await db
            .update(comments)
            .set({ downvotesCount: sql`MAX(${comments.downvotesCount} - 1, 0)` })
            .where(eq(comments.id, commentId));
        }

        action = "REMOVED";
        currentVote = null;
      } else {
        // Switch vote
        await db
          .update(votes)
          .set({ voteType })
          .where(
            and(
              eq(votes.userId, currentUser.id),
              eq(votes.targetType, "COMMENT"),
              eq(votes.targetId, commentId)
            )
          );

        if (voteType === "UP") {
          await db
            .update(comments)
            .set({
              upvotesCount: sql`${comments.upvotesCount} + 1`,
              downvotesCount: sql`MAX(${comments.downvotesCount} - 1, 0)`,
            })
            .where(eq(comments.id, commentId));
        } else {
          await db
            .update(comments)
            .set({
              downvotesCount: sql`${comments.downvotesCount} + 1`,
              upvotesCount: sql`MAX(${comments.upvotesCount} - 1, 0)`,
            })
            .where(eq(comments.id, commentId));
        }

        action = "SWITCHED";
        currentVote = voteType;
      }
    } else {
      // Add vote
      await db.insert(votes).values({
        userId: currentUser.id,
        targetType: "COMMENT",
        targetId: commentId,
        voteType,
      });

      if (voteType === "UP") {
        await db
          .update(comments)
          .set({ upvotesCount: sql`${comments.upvotesCount} + 1` })
          .where(eq(comments.id, commentId));

        if (targetComment.authorId !== currentUser.id) {
          await db.insert(notifications).values({
            id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            recipientId: targetComment.authorId,
            actorId: currentUser.id,
            type: "UPVOTE",
            postId: targetComment.postId,
            commentId,
            isRead: false,
            createdAt: new Date(),
          });
        }
      } else {
        await db
          .update(comments)
          .set({ downvotesCount: sql`${comments.downvotesCount} + 1` })
          .where(eq(comments.id, commentId));
      }

      action = "ADDED";
      currentVote = voteType;
    }

    const updatedComment = await db.query.comments.findFirst({
      where: eq(comments.id, commentId),
      columns: { upvotesCount: true, downvotesCount: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        action,
        currentVote,
        upvotesCount: updatedComment?.upvotesCount ?? 0,
        downvotesCount: updatedComment?.downvotesCount ?? 0,
      },
    });
  } catch (error) {
    console.error("POST /api/comments/[id]/vote error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to vote on comment" },
      { status: 500 }
    );
  }
}
