import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-helper";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: targetUserId } = await params;
    const currentUser = await getSessionUser(req);

    if (currentUser.role !== "INTERNAL") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only Internal Team can ban accounts." },
        { status: 403 }
      );
    }

    const targetUser = await db.query.users.findFirst({
      where: eq(users.id, targetUserId),
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const newBanStatus = !targetUser.isBanned;
    await db
      .update(users)
      .set({ isBanned: newBanStatus })
      .where(eq(users.id, targetUserId));

    return NextResponse.json({
      success: true,
      data: {
        userId: targetUserId,
        isBanned: newBanStatus,
        message: newBanStatus ? "User has been banned" : "User has been unbanned",
      },
    });
  } catch (error) {
    console.error("POST /api/admin/users/[id]/ban error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle ban status" },
      { status: 500 }
    );
  }
}
