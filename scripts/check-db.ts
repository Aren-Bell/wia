import "dotenv/config";
import { db, users, posts, comments, topics, tags, votes, notifications, reports } from "../db";
import { sql } from "drizzle-orm";

async function checkDatabase() {
  console.log("=== KAVI DATABASE HEALTH CHECK ===");
  try {
    const startTime = Date.now();
    await db.run(sql`SELECT 1`);
    const latency = Date.now() - startTime;
    console.log(`✓ Turso Connection: OK (${latency}ms)`);

    const [
      usersCount,
      postsCount,
      commentsCount,
      topicsCount,
      tagsCount,
      votesCount,
      notifsCount,
      reportsCount,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(posts),
      db.select({ count: sql<number>`count(*)` }).from(comments),
      db.select({ count: sql<number>`count(*)` }).from(topics),
      db.select({ count: sql<number>`count(*)` }).from(tags),
      db.select({ count: sql<number>`count(*)` }).from(votes),
      db.select({ count: sql<number>`count(*)` }).from(notifications),
      db.select({ count: sql<number>`count(*)` }).from(reports),
    ]);

    console.log("----------------------------------");
    console.log(`Users         : ${usersCount[0]?.count ?? 0}`);
    console.log(`Posts         : ${postsCount[0]?.count ?? 0}`);
    console.log(`Comments      : ${commentsCount[0]?.count ?? 0}`);
    console.log(`Macro Topics  : ${topicsCount[0]?.count ?? 0}`);
    console.log(`Micro Tags    : ${tagsCount[0]?.count ?? 0}`);
    console.log(`Votes Cast    : ${votesCount[0]?.count ?? 0}`);
    console.log(`Notifications : ${notifsCount[0]?.count ?? 0}`);
    console.log(`Reports       : ${reportsCount[0]?.count ?? 0}`);
    console.log("----------------------------------");
    console.log("✓ All tables intact and queryable.");
  } catch (error) {
    console.error("✗ Database check failed:", error);
    process.exitCode = 1;
  }
}

checkDatabase();
