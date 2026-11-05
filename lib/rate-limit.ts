import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window store
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 3600000); // 1 hour
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
  timer.unref?.();
}

export interface RateLimitOptions {
  limit: number; // Maximum allowed requests
  windowMs: number; // Time window in ms (e.g. 60000 for 1 minute)
}

/**
 * Checks sliding window rate limit for an identifier (User ID or IP)
 */
export function checkRateLimit(identifier: string, options: RateLimitOptions) {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  let record = rateLimitStore.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(identifier, record);
  }

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= options.limit) {
    const oldest = record.timestamps[0];
    const reset = Math.ceil((oldest + options.windowMs - now) / 1000);
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      reset: Math.max(reset, 1),
    };
  }

  record.timestamps.push(now);
  const remaining = options.limit - record.timestamps.length;
  const reset = Math.ceil(options.windowMs / 1000);

  return {
    success: true,
    limit: options.limit,
    remaining,
    reset,
  };
}

/**
 * Helper to enforce rate limiting inside route handlers.
 * Returns a 429 Response if rate limit is exceeded, or null if allowed.
 */
export function enforceRateLimit(
  req: NextRequest,
  userId: string,
  options: RateLimitOptions,
  actionKey = "general"
): NextResponse | null {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const identifier = `${actionKey}:${userId || ip}`;

  const result = checkRateLimit(identifier, options);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many requests for ${actionKey}. Please slow down and try again in ${result.reset} seconds.`,
        retryAfter: result.reset,
      },
      {
        status: 429,
        headers: {
          "Retry-After": result.reset.toString(),
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": result.reset.toString(),
        },
      }
    );
  }

  return null;
}
