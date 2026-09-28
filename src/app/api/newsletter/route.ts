import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { handleRouteError, parseJsonRequest } from "@/lib/http";
import { rateLimiters } from "@/lib/rate-limit";

const schema = z.object({
  email: z.email("Enter a valid email address.").max(254).transform((e) => e.trim().toLowerCase()),
  source: z.string().max(50).optional(),
});

/**
 * Stores the subscriber. TODO(email): send a double opt-in confirmation via the
 * email provider and set `confirmedAt` when the link is clicked.
 */
export async function POST(request: Request) {
  const parsed = await parseJsonRequest(request, schema, { limiter: rateLimiters.forms });
  if (!parsed.ok) return parsed.response;
  try {
    await getDb().newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: { unsubscribedAt: null },
      create: { email: parsed.data.email, source: parsed.data.source },
    });
    // Same response whether or not the email already existed (avoids account enumeration).
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "newsletter");
  }
}
