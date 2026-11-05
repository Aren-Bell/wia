import { NextRequest, NextResponse } from "next/server";
import { db, reports } from "@/db";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-helper";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id: reportId } = await params;
    const currentUser = await getSessionUser(req);

    if (currentUser.role !== "INTERNAL") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only Internal Team can update reports." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { status } = body;

    const validStatuses = ["PENDING", "REVIEWED", "ACTIONED", "DISMISSED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    await db
      .update(reports)
      .set({ status })
      .where(eq(reports.id, reportId));

    return NextResponse.json({
      success: true,
      data: { reportId, status, message: "Report status updated" },
    });
  } catch (error) {
    console.error("PATCH /api/admin/reports/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update report" },
      { status: 500 }
    );
  }
}
