import { describe, expect, it } from "vitest";
import { createMemoryRateLimiter } from "./rate-limit";

describe("createMemoryRateLimiter", () => {
  it("allows requests up to the limit per key", async () => {
    const limiter = createMemoryRateLimiter({ limit: 2, windowMs: 60_000 });
    expect((await limiter.limit("a")).success).toBe(true);
    expect((await limiter.limit("a")).success).toBe(true);
    expect((await limiter.limit("a")).success).toBe(false);
    expect((await limiter.limit("b")).success).toBe(true);
  });

  it("resets after the window", async () => {
    const limiter = createMemoryRateLimiter({ limit: 1, windowMs: 1 });
    await limiter.limit("a");
    await new Promise((r) => setTimeout(r, 5));
    expect((await limiter.limit("a")).success).toBe(true);
  });
});
