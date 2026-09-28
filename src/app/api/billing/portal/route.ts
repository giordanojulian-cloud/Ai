import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { BillingNotConfiguredError, createPortalSession } from "@/lib/billing/stripe";
import { handleRouteError, jsonError, parseJsonRequest } from "@/lib/http";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError(401, "Sign in to manage billing.");
  const parsed = await parseJsonRequest(request, z.object({}));
  if (!parsed.ok) return parsed.response;
  try {
    return NextResponse.json({ url: await createPortalSession(user.id) });
  } catch (error) {
    if (error instanceof BillingNotConfiguredError) return jsonError(503, "Billing isn't available yet.");
    return handleRouteError(error, "billing:portal");
  }
}
