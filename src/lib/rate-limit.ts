/**
 * Rate limiting behind a small interface so the in-memory implementation can
 * be swapped for a shared store (Upstash Redis, Vercel KV…) in production,
 * where serverless instances don't share memory.
 */
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export interface RateLimiter {
  limit(key: string): Promise<RateLimitResult>;
}

/** Fixed-window counter held in process memory. Good for dev and single-instance deploys. */
export function createMemoryRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return {
    async limit(key) {
      const now = Date.now();
      let entry = hits.get(key);
      if (!entry || entry.resetAt <= now) {
        entry = { count: 0, resetAt: now + windowMs };
        hits.set(key, entry);
      }
      entry.count++;
      if (hits.size > 10_000) {
        for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
      }
      return { success: entry.count <= limit, remaining: Math.max(0, limit - entry.count), resetAt: entry.resetAt };
    },
  };
}

// TODO(scale): replace with a shared store before running multiple instances.
export const rateLimiters = {
  /** Feedback, newsletter and suggestion forms. */
  forms: createMemoryRateLimiter({ limit: 10, windowMs: 60_000 }),
  /** Authenticated writes (saving calculations). */
  writes: createMemoryRateLimiter({ limit: 30, windowMs: 60_000 }),
  /** Paid external calls. */
  ai: createMemoryRateLimiter({ limit: 5, windowMs: 60_000 }),
};
