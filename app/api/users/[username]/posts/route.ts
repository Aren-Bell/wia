import { NextRequest, NextResponse } from "next/server";
import { db, users, posts } from "@/db";
import { eq, and, desc } from "drizzle-orm";

interface Params {
  params: Promise<{ username: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const rawUsername = (await params).username.replace(/^@/, "").trim();

    const user = await db.query.users.findFirst({
      where: eq(users.username, rawUsername),
      columns: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const userPosts = await db.query.posts.findMany({
      where: and(eq(posts.authorId, user.id), eq(posts.isDeleted, false)),
      orderBy: [desc(posts.postedAt)],
      with: {
        topic: true,
        postTags: {
          with: {
            tag: true,
          },
        },
        closedBy: {
          columns: {
            name: true,
            agencyName: true,
            role: true,
          },
        },
      },
    });

    const formatted = userPosts.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      images: p.images || [],
      locationName: p.locationName,
      province: p.province,
      status: p.status,
      closeType: p.closeType,
      resolutionCommentId: p.resolutionCommentId,
      upvotesCount: p.upvotesCount,
      commentsCount: p.commentsCount,
      viewsCount: p.viewsCount,
      postedAt: p.postedAt,
      topic: p.topic,
      tags: p.postTags.map((pt) => pt.tag),
      closedBy: p.closedBy,
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("GET /api/users/[username]/posts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user posts" },
      { status: 500 }
    );
  }
}
