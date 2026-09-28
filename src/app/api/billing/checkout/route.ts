import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { BillingNotConfiguredError, createCheckoutSession } from "@/lib/billing/stripe";
import { handleRouteError, jsonError, parseJsonRequest } from "@/lib/http";
import { rateLimiters } from "@/lib/rate-limit";

const schema = z.object({ plan: z.enum(["pro_monthly", "pro_annual"]) });

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError(401, "Sign in to upgrade.");
  const parsed = await parseJsonRequest(request, schema, { limiter: rateLimiters.writes, limiterKey: `checkout:${user.id}` });
  if (!parsed.ok) return parsed.response;
  try {
    return NextResponse.json({ url: await createCheckoutSession(user, parsed.data.plan) });
  } catch (error) {
    if (error instanceof BillingNotConfiguredError) return jsonError(503, "Pro plans aren't available yet.");
    return handleRouteError(error, "billing:checkout");
  }
}
