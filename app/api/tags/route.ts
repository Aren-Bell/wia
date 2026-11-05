import { NextRequest, NextResponse } from "next/server";
import { db, tags } from "@/db";
import { like, asc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    let listQuery = db.select().from(tags);

    if (query) {
      listQuery = db
        .select()
        .from(tags)
        .where(like(tags.name, `%${query}%`)) as typeof listQuery;
    }

    const list = await listQuery.orderBy(asc(tags.name)).limit(20);

    return NextResponse.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("GET /api/tags error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
