import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { handleRouteError, parseJsonRequest } from "@/lib/http";
import { rateLimiters } from "@/lib/rate-limit";

const schema = z.object({
  title: z.string().trim().min(3, "Tell us which calculator you'd like.").max(120),
  description: z.string().trim().max(2000).optional(),
  email: z.email("Enter a valid email address.").max(254).optional(),
  /** Honeypot: real users leave this empty. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const parsed = await parseJsonRequest(request, schema, { limiter: rateLimiters.forms });
  if (!parsed.ok) return parsed.response;
  try {
    const user = await getCurrentUser().catch(() => null);
    const { title, description, email } = parsed.data;
    await getDb().calculatorSuggestion.create({
      data: { title, description, email, userId: user && !user.id.startsWith("dev:") ? user.id : null },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "suggestions");
  }
}
