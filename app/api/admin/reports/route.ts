import { NextRequest, NextResponse } from "next/server";
import { db, reports } from "@/db";
import { desc, eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-helper";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getSessionUser(req);

    if (currentUser.role !== "INTERNAL") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only Internal Team can access moderation queues." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status") || "PENDING";

    const list = await db.query.reports.findMany({
      where: statusFilter ? eq(reports.status, statusFilter as any) : undefined,
      orderBy: [desc(reports.createdAt)],
      limit: 50,
    });

    return NextResponse.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("GET /api/admin/reports error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch moderation reports" },
      { status: 500 }
    );
  }
}
