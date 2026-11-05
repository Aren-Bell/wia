import { NextRequest, NextResponse } from "next/server";
import { db, posts, topics } from "@/db";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = (searchParams.get("mode") || "hot").toLowerCase();
    const limit = Math.min(parseInt(searchParams.get("limit") || "5", 10), 10);

    // 1. Fetch top trending topics
    const trendingTopics = await db
      .select({
        id: topics.id,
        name: topics.name,
        slug: topics.slug,
        isTrending: topics.isTrending,
      })
      .from(topics)
      .orderBy(desc(topics.isTrending))
      .limit(limit);

    // 2. Fetch trending reports based on mode
    let postsQuery = db.query.posts.findMany({
      where: and(eq(posts.isDeleted, false), eq(posts.status, "OPEN")),
      limit,
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
        topic: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },
        postTags: {
          with: {
            tag: true,
          },
        },
      },
      orderBy:
        mode === "views"
          ? [desc(posts.viewsCount), desc(posts.postedAt)]
          : mode === "upvotes"
          ? [desc(posts.upvotesCount), desc(posts.postedAt)]
          : [desc(posts.upvotesCount), desc(posts.viewsCount), desc(posts.postedAt)],
    });

    const trendingPostsRaw = await postsQuery;

    const formattedPosts = trendingPostsRaw.map((p) => ({
      id: p.id,
      title: p.title,
      province: p.province,
      locationName: p.locationName,
      upvotesCount: p.upvotesCount,
      viewsCount: p.viewsCount,
      commentsCount: p.commentsCount,
      postedAt: p.postedAt,
      author: p.author,
      topic: p.topic,
      tags: p.postTags.map((pt) => pt.tag),
    }));

    return NextResponse.json({
      success: true,
      data: {
        mode,
        topics: trendingTopics,
        posts: formattedPosts,
      },
    });
  } catch (error) {
    console.error("GET /api/trending error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch trending data" },
      { status: 500 }
    );
  }
}
