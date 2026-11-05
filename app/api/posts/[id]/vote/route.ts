import { NextRequest, NextResponse } from "next/server";
import { db, posts, votes, notifications } from "@/db";
import { eq, and, sql } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-helper";
import { enforceRateLimit } from "@/lib/rate-limit";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: postId } = await params;
    const currentUser = await getSessionUser(req);

    // Rate Limit: Max 40 votes per minute
    const rateLimitError = enforceRateLimit(req, currentUser.id, { limit: 40, windowMs: 60000 }, "vote");
    if (rateLimitError) return rateLimitError;

    const body = await req.json();

    const voteType = body?.voteType?.toUpperCase();
    if (voteType !== "UP" && voteType !== "DOWN") {
      return NextResponse.json(
        { success: false, error: "voteType must be 'UP' or 'DOWN'" },
        { status: 400 }
      );
    }

    const targetPost = await db.query.posts.findFirst({
      where: and(eq(posts.id, postId), eq(posts.isDeleted, false)),
    });

    if (!targetPost) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Check existing vote
    const existingVote = await db.query.votes.findFirst({
      where: and(
        eq(votes.userId, currentUser.id),
        eq(votes.targetType, "POST"),
        eq(votes.targetId, postId)
      ),
    });

    let action: "ADDED" | "SWITCHED" | "REMOVED";
    let currentVote: "UP" | "DOWN" | null = null;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // 1. Cancel vote (toggle off)
        await db
          .delete(votes)
          .where(
            and(
              eq(votes.userId, currentUser.id),
              eq(votes.targetType, "POST"),
              eq(votes.targetId, postId)
            )
          );

        if (voteType === "UP") {
          await db
            .update(posts)
            .set({ upvotesCount: sql`MAX(${posts.upvotesCount} - 1, 0)` })
            .where(eq(posts.id, postId));
        } else {
          await db
            .update(posts)
            .set({ downvotesCount: sql`MAX(${posts.downvotesCount} - 1, 0)` })
            .where(eq(posts.id, postId));
        }

        action = "REMOVED";
        currentVote = null;
      } else {
        // 2. Switch vote (UP -> DOWN or DOWN -> UP)
        await db
          .update(votes)
          .set({ voteType })
          .where(
            and(
              eq(votes.userId, currentUser.id),
              eq(votes.targetType, "POST"),
              eq(votes.targetId, postId)
            )
          );

        if (voteType === "UP") {
          await db
            .update(posts)
            .set({
              upvotesCount: sql`${posts.upvotesCount} + 1`,
              downvotesCount: sql`MAX(${posts.downvotesCount} - 1, 0)`,
            })
            .where(eq(posts.id, postId));
        } else {
          await db
            .update(posts)
            .set({
              downvotesCount: sql`${posts.downvotesCount} + 1`,
              upvotesCount: sql`MAX(${posts.upvotesCount} - 1, 0)`,
            })
            .where(eq(posts.id, postId));
        }

        action = "SWITCHED";
        currentVote = voteType;
      }
    } else {
      // 3. New vote
      await db.insert(votes).values({
        userId: currentUser.id,
        targetType: "POST",
        targetId: postId,
        voteType,
      });

      if (voteType === "UP") {
        await db
          .update(posts)
          .set({ upvotesCount: sql`${posts.upvotesCount} + 1` })
          .where(eq(posts.id, postId));

        // Send notification to post author if not self
        if (targetPost.authorId !== currentUser.id) {
          await db.insert(notifications).values({
            id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            recipientId: targetPost.authorId,
            actorId: currentUser.id,
            type: "UPVOTE",
            postId,
            isRead: false,
            createdAt: new Date(),
          });
        }
      } else {
        await db
          .update(posts)
          .set({ downvotesCount: sql`${posts.downvotesCount} + 1` })
          .where(eq(posts.id, postId));
      }

      action = "ADDED";
      currentVote = voteType;
    }

    // Fetch updated counters
    const updatedPost = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      columns: { upvotesCount: true, downvotesCount: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        action,
        currentVote,
        upvotesCount: updatedPost?.upvotesCount ?? 0,
        downvotesCount: updatedPost?.downvotesCount ?? 0,
      },
    });
  } catch (error) {
    console.error("POST /api/posts/[id]/vote error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process vote" },
      { status: 500 }
    );
  }
}
