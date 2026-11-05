import { NextRequest, NextResponse } from "next/server";
import { db, users, blockedUsers, follows } from "@/db";
import { eq, and, or } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-helper";

interface Params {
  params: Promise<{ id?: string; username: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const rawUsername = (await params).username.replace(/^@/, "").trim();
    const currentUser = await getSessionUser(req);

    const targetUser = await db.query.users.findFirst({
      where: eq(users.username, rawUsername),
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (targetUser.id === currentUser.id) {
      return NextResponse.json(
        { success: false, error: "You cannot block yourself" },
        { status: 400 }
      );
    }

    const existingBlock = await db.query.blockedUsers.findFirst({
      where: and(
        eq(blockedUsers.userId, currentUser.id),
        eq(blockedUsers.blockedUserId, targetUser.id)
      ),
    });

    if (existingBlock) {
      await db
        .delete(blockedUsers)
        .where(
          and(
            eq(blockedUsers.userId, currentUser.id),
            eq(blockedUsers.blockedUserId, targetUser.id)
          )
        );

      return NextResponse.json({
        success: true,
        data: { isBlocked: false, message: `Unblocked @${targetUser.username}` },
      });
    }

    // 1. Block
    await db.insert(blockedUsers).values({
      userId: currentUser.id,
      blockedUserId: targetUser.id,
      createdAt: new Date(),
    });

    // 2. Break mutual follow relations
    await db
      .delete(follows)
      .where(
        or(
          and(eq(follows.followerId, currentUser.id), eq(follows.followingId, targetUser.id)),
          and(eq(follows.followerId, targetUser.id), eq(follows.followingId, currentUser.id))
        )
      );

    return NextResponse.json({
      success: true,
      data: { isBlocked: true, message: `@${targetUser.username} has been blocked` },
    });
  } catch (error) {
    console.error("POST /api/users/[username]/block error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process block" },
      { status: 500 }
    );
  }
}
