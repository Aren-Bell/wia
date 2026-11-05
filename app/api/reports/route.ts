import { NextRequest, NextResponse } from "next/server";
import { db, reports, hiddenPosts } from "@/db";
import { getSessionUser } from "@/lib/auth-helper";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getSessionUser(req);
    const body = await req.json();

    const { targetType, targetId, category, details } = body;

    if (!targetType || !["POST", "COMMENT", "USER"].includes(targetType)) {
      return NextResponse.json(
        { success: false, error: "targetType must be POST, COMMENT, or USER" },
        { status: 400 }
      );
    }

    if (!targetId || typeof targetId !== "string") {
      return NextResponse.json(
        { success: false, error: "targetId is required" },
        { status: 400 }
      );
    }

    const validCategories = ["HOAX", "HATE_SPEECH", "SPAM", "PORNOGRAPHY", "OTHER"];
    if (!category || !validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: `category must be one of: ${validCategories.join(", ")}` },
        { status: 400 }
      );
    }

    const reportId = `rep_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date();

    // 1. Insert into reports queue
    await db.insert(reports).values({
      id: reportId,
      reporterId: currentUser.id,
      targetType,
      targetId,
      category,
      details: details ? String(details).trim() : null,
      status: "PENDING",
      createdAt: now,
    });

    // 2. If reporting a post, auto-hide it from reporter's feed
    if (targetType === "POST") {
      await db
        .insert(hiddenPosts)
        .values({
          userId: currentUser.id,
          postId: targetId,
          createdAt: now,
        })
        .onConflictDoNothing();
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          reportId,
          message: "Thank you. Your report has been submitted to the moderation team.",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reports error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit report" },
      { status: 500 }
    );
  }
}
