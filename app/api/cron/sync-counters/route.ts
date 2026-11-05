import { NextRequest, NextResponse } from "next/server";
import { flushBufferedCountersToDb } from "@/lib/redis";

/**
 * Hourly cron route to flush buffered high-velocity counters (views, likes, reposts)
 * from Upstash Redis into Turso SQLite database.
 *
 * Configured in vercel.json:
 * { "schedule": "0 * * * *" }
 */
export async function GET(req: NextRequest) {
  return handleSync(req);
}

export async function POST(req: NextRequest) {
  return handleSync(req);
}

async function handleSync(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const isVercelCron = req.headers.get("x-vercel-cron") === "1";
    const cronSecret = process.env.CRON_SECRET;

    // Secure cron endpoint against unauthorized calls
    if (process.env.NODE_ENV === "production" && cronSecret) {
      if (!isVercelCron && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { success: false, error: "Unauthorized cron invocation" },
          { status: 401 }
        );
      }
    }

    const result = await flushBufferedCountersToDb();

    return NextResponse.json({
      success: true,
      message: `Flushed buffered counters to Turso for ${result.syncedCount} post(s)`,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("GET /api/cron/sync-counters error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to flush buffered counters" },
      { status: 500 }
    );
  }
}
