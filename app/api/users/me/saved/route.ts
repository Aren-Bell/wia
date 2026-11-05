import { NextRequest, NextResponse } from "next/server";
import { db, savedPosts, posts } from "@/db";
import { eq, desc } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth-helper";

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getSessionUser(req);

    const saved = await db.query.savedPosts.findMany({
      where: eq(savedPosts.userId, currentUser.id),
      orderBy: [desc(savedPosts.createdAt)],
      with: {
        post: {
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
        },
      },
    });

    const formatted = saved
      .filter((s) => s.post && !s.post.isDeleted)
      .map((s) => ({
        savedAt: s.createdAt,
        post: {
          id: s.post.id,
          title: s.post.title,
          content: s.post.content,
          images: s.post.images || [],
          locationName: s.post.locationName,
          province: s.post.province,
          status: s.post.status,
          closeType: s.post.closeType,
          upvotesCount: s.post.upvotesCount,
          commentsCount: s.post.commentsCount,
          viewsCount: s.post.viewsCount,
          postedAt: s.post.postedAt,
          author: s.post.author,
          topic: s.post.topic,
          tags: s.post.postTags.map((pt) => pt.tag),
        },
      }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("GET /api/users/me/saved error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch saved posts" },
      { status: 500 }
    );
  }
}
