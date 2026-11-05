import { NextRequest, NextResponse } from "next/server";
import { db, posts, users, topics } from "@/db";
import { eq, and, sql, desc } from "drizzle-orm";

/**
 * GET /api/analytics
 * Provides civic impact statistics.
 * - Global mode (default): National resolution rate, status breakdown, province ranking, top topics.
 * - User mode (?userId=... or ?username=...): Citizen/agency personal score & impact breakdown.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");
    const usernameParam = searchParams.get("username")?.replace(/^@/, "").trim();

    // -------------------------------------------------------------
    // USER SCORECARD MODE (For User Profile "Statistics" Subtab)
    // -------------------------------------------------------------
    if (userIdParam || usernameParam) {
      let targetUser;
      if (userIdParam) {
        targetUser = await db.query.users.findFirst({
          where: eq(users.id, userIdParam),
          columns: { id: true, name: true, username: true, role: true, agencyName: true },
        });
      } else if (usernameParam) {
        targetUser = await db.query.users.findFirst({
          where: eq(users.username, usernameParam),
          columns: { id: true, name: true, username: true, role: true, agencyName: true },
        });
      }

      if (!targetUser) {
        return NextResponse.json(
          { success: false, error: "Target user not found" },
          { status: 404 }
        );
      }

      const [statusCounts, upvotesReceived] = await Promise.all([
        db
          .select({
            status: posts.status,
            closeType: posts.closeType,
            count: sql<number>`count(*)`,
          })
          .from(posts)
          .where(and(eq(posts.authorId, targetUser.id), eq(posts.isDeleted, false)))
          .groupBy(posts.status, posts.closeType),
        db
          .select({
            totalUpvotes: sql<number>`coalesce(sum(${posts.upvotesCount}), 0)`,
            totalViews: sql<number>`coalesce(sum(${posts.viewsCount}), 0)`,
          })
          .from(posts)
          .where(and(eq(posts.authorId, targetUser.id), eq(posts.isDeleted, false))),
      ]);

      let total = 0;
      let open = 0;
      let solved = 0;
      let closed = 0;

      for (const row of statusCounts) {
        const count = Number(row.count);
        total += count;
        if (row.status === "OPEN") open += count;
        if (row.status === "CLOSED" && row.closeType === "SOLVED") solved += count;
        if (row.status === "CLOSED" && row.closeType !== "SOLVED") closed += count;
      }

      const resolutionRate = total > 0 ? Math.round((solved / total) * 100) : 0;

      return NextResponse.json({
        success: true,
        mode: "user",
        data: {
          user: targetUser,
          summary: {
            totalReports: total,
            openReports: open,
            solvedReports: solved,
            closedReports: closed,
            resolutionRatePercentage: resolutionRate,
            totalUpvotesReceived: Number(upvotesReceived[0]?.totalUpvotes || 0),
            totalViewsReceived: Number(upvotesReceived[0]?.totalViews || 0),
          },
        },
      });
    }

    // -------------------------------------------------------------
    // GLOBAL CIVIC IMPACT MODE (National Transparency Dashboard)
    // -------------------------------------------------------------
    const [statusSummary, provinceBreakdown, topicBreakdown] = await Promise.all([
      db
        .select({
          status: posts.status,
          closeType: posts.closeType,
          count: sql<number>`count(*)`,
        })
        .from(posts)
        .where(eq(posts.isDeleted, false))
        .groupBy(posts.status, posts.closeType),

      db
        .select({
          province: posts.province,
          total: sql<number>`count(*)`,
          solved: sql<number>`count(case when ${posts.status} = 'CLOSED' and ${posts.closeType} = 'SOLVED' then 1 end)`,
        })
        .from(posts)
        .where(eq(posts.isDeleted, false))
        .groupBy(posts.province)
        .orderBy(desc(sql`count(*)`))
        .limit(10),

      db
        .select({
          topicId: posts.topicId,
          topicName: topics.name,
          count: sql<number>`count(*)`,
        })
        .from(posts)
        .innerJoin(topics, eq(posts.topicId, topics.id))
        .where(eq(posts.isDeleted, false))
        .groupBy(posts.topicId, topics.name)
        .orderBy(desc(sql`count(*)`))
        .limit(5),
    ]);

    let totalReports = 0;
    let openReports = 0;
    let solvedReports = 0;
    let closedReports = 0;

    for (const row of statusSummary) {
      const c = Number(row.count);
      totalReports += c;
      if (row.status === "OPEN") openReports += c;
      if (row.status === "CLOSED" && row.closeType === "SOLVED") solvedReports += c;
      if (row.status === "CLOSED" && row.closeType !== "SOLVED") closedReports += c;
    }

    const resolutionRate =
      totalReports > 0 ? Math.round((solvedReports / totalReports) * 100) : 0;

    return NextResponse.json({
      success: true,
      mode: "global",
      data: {
        summary: {
          totalReports,
          openReports,
          solvedReports,
          closedReports,
          resolutionRatePercentage: resolutionRate,
        },
        provinces: provinceBreakdown.map((p) => {
          const tot = Number(p.total);
          const sol = Number(p.solved);
          return {
            province: p.province,
            totalReports: tot,
            solvedReports: sol,
            resolutionRatePercentage: tot > 0 ? Math.round((sol / tot) * 100) : 0,
          };
        }),
        topTopics: topicBreakdown.map((t) => ({
          id: t.topicId,
          name: t.topicName,
          reportsCount: Number(t.count),
        })),
      },
    });
  } catch (error: any) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate analytics" },
      { status: 500 }
    );
  }
}
