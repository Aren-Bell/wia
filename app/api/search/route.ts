import { NextRequest, NextResponse } from "next/server";
import { db, posts, topics, users } from "@/db";
import { like, or, and, eq, desc } from "drizzle-orm";

/**
 * GET /api/search?q=...&type=all|posts|topics|users&limit=10
 * Global search across public issues, topics, and agency/citizen profiles.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const type = (searchParams.get("type") || "all").toLowerCase();
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 10, 1), 50);

    if (q.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Query parameter 'q' must be at least 2 characters long",
        },
        { status: 400 }
      );
    }

    const searchPattern = `%${q}%`;
    const results: {
      posts?: any[];
      topics?: any[];
      users?: any[];
    } = {};

    // 1. Search Posts / Issues
    if (type === "all" || type === "posts") {
      const matchedPosts = await db.query.posts.findMany({
        where: and(
          eq(posts.isDeleted, false),
          or(
            like(posts.title, searchPattern),
            like(posts.content, searchPattern),
            like(posts.locationName, searchPattern),
            like(posts.province, searchPattern)
          )
        ),
        limit,
        orderBy: [desc(posts.postedAt)],
        with: {
          author: {
            columns: {
              id: true,
              name: true,
              username: true,
              image: true,
              role: true,
              agencyName: true,
            },
          },
          topic: true,
          postTags: {
            with: {
              tag: true,
            },
          },
        },
      });

      results.posts = matchedPosts.map((p) => ({
        id: p.id,
        title: p.title,
        content: p.content,
        locationName: p.locationName,
        province: p.province,
        status: p.status,
        closeType: p.closeType,
        upvotesCount: p.upvotesCount,
        commentsCount: p.commentsCount,
        viewsCount: p.viewsCount,
        postedAt: p.postedAt,
        author: p.author,
        topic: p.topic,
        tags: p.postTags.map((pt) => pt.tag),
      }));
    }

    // 2. Search Topics
    if (type === "all" || type === "topics") {
      results.topics = await db.query.topics.findMany({
        where: or(
          like(topics.name, searchPattern),
          like(topics.slug, searchPattern)
        ),
        limit: 5,
      });
    }

    // 3. Search Users / Agencies
    if (type === "all" || type === "users") {
      results.users = await db.query.users.findMany({
        where: or(
          like(users.name, searchPattern),
          like(users.username, searchPattern),
          like(users.agencyName, searchPattern)
        ),
        columns: {
          id: true,
          name: true,
          username: true,
          image: true,
          role: true,
          agencyName: true,
          jurisdictionProvince: true,
          followerCount: true,
          postCount: true,
        },
        limit: 5,
      });
    }

    return NextResponse.json({
      success: true,
      query: q,
      type,
      data: results,
    });
  } catch (error: any) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { success: false, error: "Search query failed" },
      { status: 500 }
    );
  }
}
