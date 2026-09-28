import { NextResponse } from "next/server";
import type { z } from "zod";
import { DatabaseNotConfiguredError } from "./db";
import type { RateLimiter } from "./rate-limit";

export function jsonError(status: number, error: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ error, ...extra }, { status });
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/**
 * CSRF protection for cookie-authenticated JSON endpoints: browsers always send
 * Origin on cross-site POSTs, so we require it to match our host. Combined with
 * requiring a JSON content type (which forces a CORS preflight), plain HTML
 * form posts from other sites are rejected.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") !== "cross-site";
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const MAX_BODY_BYTES = 32 * 1024;

type Parsed<T> = { ok: true; data: T } | { ok: false; response: NextResponse };

/** Validates origin, content type, size, rate limit and body schema in one place. */
export async function parseJsonRequest<S extends z.ZodType>(
  request: Request,
  schema: S,
  options: { limiter?: RateLimiter; limiterKey?: string } = {},
): Promise<Parsed<z.infer<S>>> {
  if (!isSameOrigin(request)) return { ok: false, response: jsonError(403, "Cross-origin requests are not allowed.") };
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return { ok: false, response: jsonError(415, "Expected a JSON body.") };
  }
  if (options.limiter) {
    const result = await options.limiter.limit(options.limiterKey ?? clientIp(request));
    if (!result.success) {
      const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
      return {
        ok: false,
        response: NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429, headers: { "Retry-After": String(retryAfter) } }),
      };
    }
  }
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return { ok: false, response: jsonError(413, "Request body is too large.") };
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return { ok: false, response: jsonError(400, "Invalid JSON.") };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, response: jsonError(400, parsed.error.issues[0]?.message ?? "Invalid request.", { issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) }) };
  }
  return { ok: true, data: parsed.data };
}

/** Maps known infrastructure errors to friendly responses. */
export function handleRouteError(error: unknown, context: string) {
  if (error instanceof DatabaseNotConfiguredError) {
    return jsonError(503, "This feature isn't available yet. Please try again later.");
  }
  console.error(`[${context}]`, error);
  return jsonError(500, "Something went wrong. Please try again.");
}
