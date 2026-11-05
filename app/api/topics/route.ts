import { NextResponse } from "next/server";
import { db, topics } from "@/db";
import { desc, asc } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db
      .select()
      .from(topics)
      .orderBy(desc(topics.isTrending), asc(topics.name));

    return NextResponse.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("GET /api/topics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}
