import "dotenv/config";
import { Redis } from "@upstash/redis";
import { db, posts } from "@/db";
import { eq, sql } from "drizzle-orm";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

/**
 * In-memory fallback implementing essential Upstash Redis commands
 * when UPSTASH_REDIS_REST_URL/TOKEN are not set in .env (e.g. local dev, unit tests).
 */
class InMemoryRedisFallback {
  private store = new Map<string, { value: any; expiresAt?: number }>();
  private sets = new Map<string, Set<string>>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value as T;
  }

  async set(
    key: string,
    value: any,
    opts?: { ex?: number; px?: number; nx?: boolean }
  ): Promise<string | null> {
    const existing = await this.get(key);
    if (opts?.nx && existing !== null && existing !== undefined) {
      return null;
    }
    const expiresAt = opts?.ex
      ? Date.now() + opts.ex * 1000
      : opts?.px
      ? Date.now() + opts.px
      : undefined;

    this.store.set(key, { value, expiresAt });
    return "OK";
  }

  async del(key: string): Promise<number> {
    const deletedStore = this.store.delete(key);
    const deletedSet = this.sets.delete(key);
    return deletedStore || deletedSet ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    return this.incrby(key, 1);
  }

  async decr(key: string): Promise<number> {
    return this.incrby(key, -1);
  }

  async incrby(key: string, increment: number): Promise<number> {
    const current = Number((await this.get<number>(key)) || 0);
    const next = current + increment;
    this.store.set(key, { value: next });
    return next;
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    let set = this.sets.get(key);
    if (!set) {
      set = new Set();
      this.sets.set(key, set);
    }
    let added = 0;
    for (const m of members) {
      if (!set.has(m)) {
        set.add(m);
        added++;
      }
    }
    return added;
  }

  async smembers(key: string): Promise<string[]> {
    const set = this.sets.get(key);
    return set ? Array.from(set) : [];
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    const set = this.sets.get(key);
    if (!set) return 0;
    let removed = 0;
    for (const m of members) {
      if (set.delete(m)) removed++;
    }
    return removed;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.store.get(key);
    if (!item) return 0;
    item.expiresAt = Date.now() + seconds * 1000;
    return 1;
  }
}

export const isLiveRedis = Boolean(url && token);

// Export active client (Upstash cloud when credentials exist, else memory fallback)
export const redis: Redis | InMemoryRedisFallback = isLiveRedis
  ? new Redis({ url: url!, token: token! })
  : new InMemoryRedisFallback();

export interface PostCachedCounters {
  upvotesCount: number;
  downvotesCount: number;
  repostsCount: number;
}

/**
 * Anti-spam double click lock using Redis SET ... NX PX.
 * Returns true if lock was acquired, false if action is spamming / duplicate.
 */
export async function acquireActionLock(lockKey: string, ttlMs = 600): Promise<boolean> {
  try {
    const res = await redis.set(`lock:${lockKey}`, "1", { nx: true, px: ttlMs });
    return res === "OK";
  } catch (err) {
    console.warn("Redis acquireActionLock error:", err);
    return true; // fail-open so user action is not permanently blocked
  }
}

/**
 * Get cached post counters from Redis to prevent querying Turso repeatedly.
 */
export async function getCachedPostCounters(postId: string): Promise<PostCachedCounters | null> {
  try {
    return await redis.get<PostCachedCounters>(`post:${postId}:counters`);
  } catch {
    return null;
  }
}

/**
 * Update cached post counters in Redis with 1-minute TTL.
 */
export async function setCachedPostCounters(
  postId: string,
  counters: PostCachedCounters,
  ttlSeconds = 60
): Promise<void> {
  try {
    await redis.set(`post:${postId}:counters`, counters, { ex: ttlSeconds });
  } catch (err) {
    console.warn("Redis setCachedPostCounters error:", err);
  }
}

/**
 * Cache user's interaction state with a post (UP, DOWN, or null) for instant check.
 */
export async function getCachedUserVote(
  userId: string,
  postId: string
): Promise<"UP" | "DOWN" | "NONE" | null> {
  try {
    return await redis.get<"UP" | "DOWN" | "NONE">(`vote:${userId}:${postId}`);
  } catch {
    return null;
  }
}

export async function setCachedUserVote(
  userId: string,
  postId: string,
  voteType: "UP" | "DOWN" | "NONE",
  ttlSeconds = 300
): Promise<void> {
  try {
    await redis.set(`vote:${userId}:${postId}`, voteType, { ex: ttlSeconds });
  } catch (err) {
    console.warn("Redis setCachedUserVote error:", err);
  }
}

/**
 * Cache user's repost state (true/false) for instant check.
 */
export async function getCachedUserRepost(userId: string, postId: string): Promise<boolean | null> {
  try {
    return await redis.get<boolean>(`repost:${userId}:${postId}`);
  } catch {
    return null;
  }
}

export async function setCachedUserRepost(
  userId: string,
  postId: string,
  hasReposted: boolean,
  ttlSeconds = 300
): Promise<void> {
  try {
    await redis.set(`repost:${userId}:${postId}`, hasReposted, { ex: ttlSeconds });
  } catch (err) {
    console.warn("Redis setCachedUserRepost error:", err);
  }
}

// =========================================================================
// WRITE-BEHIND BUFFER ENGINE (Hourly / Periodic Batch Sync to Turso)
// =========================================================================

const DIRTY_POSTS_KEY = "buffer:dirty_posts";

/**
 * Fast buffer for post views.
 * Absorbs 100,000s of views in Redis without executing a single SQL query in Turso!
 */
export async function recordPostViewBuffered(postId: string): Promise<number> {
  try {
    const totalPendingViews = await redis.incr(`buffer:post:${postId}:views`);
    await redis.sadd(DIRTY_POSTS_KEY, postId);
    return totalPendingViews;
  } catch (err) {
    console.warn("recordPostViewBuffered error:", err);
    return 1;
  }
}

/**
 * Buffer vote counter deltas in Redis
 */
export async function recordPostVoteBuffered(
  postId: string,
  deltaUp: number,
  deltaDown: number
): Promise<void> {
  try {
    if (deltaUp !== 0) {
      await redis.incrby(`buffer:post:${postId}:upvotes`, deltaUp);
    }
    if (deltaDown !== 0) {
      await redis.incrby(`buffer:post:${postId}:downvotes`, deltaDown);
    }
    await redis.sadd(DIRTY_POSTS_KEY, postId);
  } catch (err) {
    console.warn("recordPostVoteBuffered error:", err);
  }
}

/**
 * Buffer repost counter deltas in Redis
 */
export async function recordPostRepostBuffered(
  postId: string,
  deltaRepost: number
): Promise<void> {
  try {
    if (deltaRepost !== 0) {
      await redis.incrby(`buffer:post:${postId}:reposts`, deltaRepost);
    }
    await redis.sadd(DIRTY_POSTS_KEY, postId);
  } catch (err) {
    console.warn("recordPostRepostBuffered error:", err);
  }
}

/**
 * Read current buffered deltas for a post
 */
export async function getPostBufferedDeltas(postId: string) {
  try {
    const [views, upvotes, downvotes, reposts] = await Promise.all([
      redis.get<number>(`buffer:post:${postId}:views`),
      redis.get<number>(`buffer:post:${postId}:upvotes`),
      redis.get<number>(`buffer:post:${postId}:downvotes`),
      redis.get<number>(`buffer:post:${postId}:reposts`),
    ]);

    return {
      views: Number(views || 0),
      upvotes: Number(upvotes || 0),
      downvotes: Number(downvotes || 0),
      reposts: Number(reposts || 0),
    };
  } catch {
    return { views: 0, upvotes: 0, downvotes: 0, reposts: 0 };
  }
}

/**
 * Batch flushes all buffered Redis deltas into Turso DB.
 * Executed by the hourly cron job or manual trigger (`POST /api/cron/sync-counters`).
 */
export async function flushBufferedCountersToDb() {
  const dirtyPostIds = await redis.smembers(DIRTY_POSTS_KEY);
  if (!dirtyPostIds || dirtyPostIds.length === 0) {
    return { syncedCount: 0, posts: [] };
  }

  const syncDetails: Array<{
    postId: string;
    views: number;
    upvotes: number;
    downvotes: number;
    reposts: number;
  }> = [];

  for (const postId of dirtyPostIds) {
    const deltas = await getPostBufferedDeltas(postId);

    if (
      deltas.views !== 0 ||
      deltas.upvotes !== 0 ||
      deltas.downvotes !== 0 ||
      deltas.reposts !== 0
    ) {
      // Execute consolidated SQL update on Turso
      await db
        .update(posts)
        .set({
          viewsCount: sql`MAX(${posts.viewsCount} + ${deltas.views}, 0)`,
          upvotesCount: sql`MAX(${posts.upvotesCount} + ${deltas.upvotes}, 0)`,
          downvotesCount: sql`MAX(${posts.downvotesCount} + ${deltas.downvotes}, 0)`,
          repostsCount: sql`MAX(${posts.repostsCount} + ${deltas.reposts}, 0)`,
        })
        .where(eq(posts.id, postId));

      syncDetails.push({ postId, ...deltas });
    }

    // Clear the buffered keys in Redis for this post
    await Promise.all([
      redis.del(`buffer:post:${postId}:views`),
      redis.del(`buffer:post:${postId}:upvotes`),
      redis.del(`buffer:post:${postId}:downvotes`),
      redis.del(`buffer:post:${postId}:reposts`),
      redis.srem(DIRTY_POSTS_KEY, postId),
    ]);
  }

  return {
    syncedCount: syncDetails.length,
    posts: syncDetails,
  };
}
