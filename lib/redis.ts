import "dotenv/config";
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

/**
 * In-memory fallback implementing essential Upstash Redis commands
 * when UPSTASH_REDIS_REST_URL/TOKEN are not set in .env (e.g. local dev, unit tests).
 */
class InMemoryRedisFallback {
  private store = new Map<string, { value: any; expiresAt?: number }>();

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
    return this.store.delete(key) ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const current = (await this.get<number>(key)) || 0;
    const next = current + 1;
    this.store.set(key, { value: next });
    return next;
  }

  async decr(key: string): Promise<number> {
    const current = (await this.get<number>(key)) || 0;
    const next = Math.max(0, current - 1);
    this.store.set(key, { value: next });
    return next;
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
export const redis = isLiveRedis
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
