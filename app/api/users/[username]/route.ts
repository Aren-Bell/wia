import { NextRequest, NextResponse } from "next/server";
import { db, users, follows, mutedUsers, blockedUsers } from "@/db";
import { eq, and } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-helper";

interface Params {
  params: Promise<{ username: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const rawUsername = (await params).username.replace(/^@/, "").trim();
    const currentUser = await getSessionUser(req);

    const user = await db.query.users.findFirst({
      where: eq(users.username, rawUsername),
      columns: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        role: true,
        agencyName: true,
        jurisdictionProvince: true,
        postCount: true,
        followerCount: true,
        followingCount: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User profile not found" },
        { status: 404 }
      );
    }

    const isSelf = user.id === currentUser.id;

    // Check relationship flags
    const [followRecord, muteRecord, blockRecord] = isSelf
      ? [null, null, null]
      : await Promise.all([
          db.query.follows.findFirst({
            where: and(eq(follows.followerId, currentUser.id), eq(follows.followingId, user.id)),
          }),
          db.query.mutedUsers.findFirst({
            where: and(eq(mutedUsers.userId, currentUser.id), eq(mutedUsers.mutedUserId, user.id)),
          }),
          db.query.blockedUsers.findFirst({
            where: and(eq(blockedUsers.userId, currentUser.id), eq(blockedUsers.blockedUserId, user.id)),
          }),
        ]);

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        isSelf,
        isFollowing: !!followRecord,
        isMuted: !!muteRecord,
        isBlocked: !!blockRecord,
      },
    });
  } catch (error) {
    console.error("GET /api/users/[username] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
