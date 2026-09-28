import { NextResponse } from "next/server";
import { BillingNotConfiguredError, constructWebhookEvent, handleWebhookEvent } from "@/lib/billing/stripe";
import { jsonError } from "@/lib/http";

/** Stripe webhook. Authenticity comes from the signature, so no origin check here. */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return jsonError(400, "Missing signature.");
  const payload = await request.text();
  let event;
  try {
    event = constructWebhookEvent(payload, signature);
  } catch (error) {
    if (error instanceof BillingNotConfiguredError) return jsonError(503, "Billing is not configured.");
    return jsonError(400, "Invalid signature.");
  }
  try {
    await handleWebhookEvent(event);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[billing:webhook]", event.type, error);
    // 500 makes Stripe retry the delivery.
    return jsonError(500, "Webhook handling failed.");
  }
}
