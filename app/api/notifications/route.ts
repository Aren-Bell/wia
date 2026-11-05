import { NextRequest, NextResponse } from "next/server";
import { db, notifications } from "@/db";
import { eq, desc, inArray, and } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-helper";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getSessionUser(req);

    const list = await db.query.notifications.findMany({
      where: eq(notifications.recipientId, currentUser.id),
      orderBy: [desc(notifications.createdAt)],
      limit: 50,
      with: {
        actor: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
            role: true,
            agencyName: true,
          },
        },
        post: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
    });

    const unreadCount = list.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      data: {
        unreadCount,
        notifications: list,
      },
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const currentUser = await getSessionUser(req);
    const body = await req.json().catch(() => ({}));
    const { notificationIds } = body;

    if (Array.isArray(notificationIds) && notificationIds.length > 0) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.recipientId, currentUser.id),
            inArray(notifications.id, notificationIds)
          )
        );
    } else {
      // Mark all as read
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.recipientId, currentUser.id));
    }

    return NextResponse.json({
      success: true,
      message: "Notifications marked as read",
    });
  } catch (error) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
