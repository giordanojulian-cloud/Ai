import { NextResponse } from "next/server";
import { z } from "zod";
import { hasImplementation } from "@/calculators/registry";
import { getCurrentUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { handleRouteError, jsonError, parseJsonRequest } from "@/lib/http";
import { rateLimiters } from "@/lib/rate-limit";

const schema = z.object({
  calculatorSlug: z.string().max(100),
  helpful: z.boolean(),
  comment: z.string().trim().max(1000).optional(),
});

export async function POST(request: Request) {
  const parsed = await parseJsonRequest(request, schema, { limiter: rateLimiters.forms });
  if (!parsed.ok) return parsed.response;
  if (!hasImplementation(parsed.data.calculatorSlug)) return jsonError(404, "Unknown calculator.");
  try {
    const user = await getCurrentUser().catch(() => null);
    await getDb().feedback.create({ data: { ...parsed.data, userId: user?.id.startsWith("dev:") ? null : (user?.id ?? null) } });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "feedback");
  }
}
