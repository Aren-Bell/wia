import { NextRequest, NextResponse } from "next/server";
import { db, users, notifications } from "@/db";
import { eq, sql } from "drizzle-orm";
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
        { success: false, error: "Forbidden: Only Internal Team can issue administrative warnings." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Warning message is required." },
        { status: 400 }
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

    // 1. Increment warning counter
    await db
      .update(users)
      .set({ warningCount: sql`${users.warningCount} + 1` })
      .where(eq(users.id, targetUserId));

    // 2. Dispatch official warning notification
    await db.insert(notifications).values({
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      recipientId: targetUserId,
      actorId: currentUser.id,
      type: "SYSTEM",
      message: message.trim(),
      isRead: false,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: {
        userId: targetUserId,
        warningCount: targetUser.warningCount + 1,
        message: "Warning issued successfully",
      },
    });
  } catch (error) {
    console.error("POST /api/admin/users/[id]/warn error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to issue warning" },
      { status: 500 }
    );
  }
}
