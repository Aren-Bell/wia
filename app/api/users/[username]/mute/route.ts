import { NextRequest, NextResponse } from "next/server";
import { db, users, mutedUsers } from "@/db";
import { eq, and } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-helper";

interface Params {
  params: Promise<{ username: string }>;
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
        { success: false, error: "You cannot mute yourself" },
        { status: 400 }
      );
    }

    const existingMute = await db.query.mutedUsers.findFirst({
      where: and(
        eq(mutedUsers.userId, currentUser.id),
        eq(mutedUsers.mutedUserId, targetUser.id)
      ),
    });

    if (existingMute) {
      await db
        .delete(mutedUsers)
        .where(
          and(
            eq(mutedUsers.userId, currentUser.id),
            eq(mutedUsers.mutedUserId, targetUser.id)
          )
        );

      return NextResponse.json({
        success: true,
        data: { isMuted: false, message: `Unmuted @${targetUser.username}` },
      });
    }

    await db.insert(mutedUsers).values({
      userId: currentUser.id,
      mutedUserId: targetUser.id,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: { isMuted: true, message: `@${targetUser.username} has been muted` },
    });
  } catch (error) {
    console.error("POST /api/users/[username]/mute error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process mute" },
      { status: 500 }
    );
  }
}
