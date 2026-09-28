import Stripe from "stripe";
import { absoluteUrl } from "@/config/site";
import { getDb } from "@/lib/db";
import { features } from "@/lib/env";
import { planForPriceId, priceIdForPlan, type PlanId } from "./plans";

/**
 * Stripe integration boundary. Nothing outside src/lib/billing talks to
 * Stripe directly, so swapping processors only touches this folder.
 */

let client: Stripe | null = null;

export class BillingNotConfiguredError extends Error {
  constructor() {
    super("Billing is not configured.");
    this.name = "BillingNotConfiguredError";
  }
}

export function getStripe(): Stripe {
  if (!features.stripe) throw new BillingNotConfiguredError();
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY!);
  return client;
}

async function getOrCreateCustomer(user: { id: string; email?: string | null }): Promise<string> {
  const existing = await getDb().premiumSubscription.findUnique({ where: { userId: user.id }, select: { stripeCustomerId: true } });
  if (existing) return existing.stripeCustomerId;
  const customer = await getStripe().customers.create({ email: user.email ?? undefined, metadata: { userId: user.id } });
  await getDb().premiumSubscription.create({
    data: { userId: user.id, stripeCustomerId: customer.id, status: "INCOMPLETE", tier: "FREE" },
  });
  return customer.id;
}

export async function createCheckoutSession(user: { id: string; email?: string | null }, plan: Exclude<PlanId, "free">): Promise<string> {
  const price = priceIdForPlan(plan);
  if (!price) throw new BillingNotConfiguredError();
  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer: await getOrCreateCustomer(user),
    line_items: [{ price, quantity: 1 }],
    client_reference_id: user.id,
    subscription_data: { metadata: { userId: user.id } },
    allow_promotion_codes: true,
    success_url: absoluteUrl("/account?checkout=success"),
    cancel_url: absoluteUrl("/pricing?checkout=canceled"),
  });
  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  return session.url;
}

export async function createPortalSession(userId: string): Promise<string> {
  const record = await getDb().premiumSubscription.findUnique({ where: { userId }, select: { stripeCustomerId: true } });
  if (!record) throw new Error("No billing account for this user.");
  const session = await getStripe().billingPortal.sessions.create({ customer: record.stripeCustomerId, return_url: absoluteUrl("/account") });
  return session.url;
}

const STATUS_MAP: Record<Stripe.Subscription.Status, "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "INCOMPLETE" | "INCOMPLETE_EXPIRED" | "UNPAID" | "PAUSED"> = {
  trialing: "TRIALING",
  active: "ACTIVE",
  past_due: "PAST_DUE",
  canceled: "CANCELED",
  incomplete: "INCOMPLETE",
  incomplete_expired: "INCOMPLETE_EXPIRED",
  unpaid: "UNPAID",
  paused: "PAUSED",
};

/** Mirrors a Stripe subscription into our database (the source of truth for entitlements). */
export async function syncSubscription(subscription: Stripe.Subscription): Promise<void> {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const item = subscription.items.data[0];
  const priceId = item?.price.id ?? null;
  const periodEnd = item?.current_period_end;
  await getDb().premiumSubscription.update({
    where: { stripeCustomerId: customerId },
    data: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      status: STATUS_MAP[subscription.status],
      tier: planForPriceId(priceId) ? "PRO" : "FREE",
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

export function constructWebhookEvent(payload: string, signature: string): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new BillingNotConfiguredError();
  return getStripe().webhooks.constructEvent(payload, signature, secret);
}

export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.mode === "subscription" && typeof session.subscription === "string") {
        await syncSubscription(await getStripe().subscriptions.retrieve(session.subscription));
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await syncSubscription(event.data.object);
      break;
    default:
      // Other events are acknowledged but ignored.
      break;
  }
}
