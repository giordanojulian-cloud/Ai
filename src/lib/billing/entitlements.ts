import { getDb } from "@/lib/db";
import { features as env } from "@/lib/env";
import { FREE_FEATURES, PRO_FEATURES, type Feature } from "./plans";

export interface Entitlements {
  tier: "FREE" | "PRO";
  features: Feature[];
  subscription?: { status: string; currentPeriodEnd: Date | null; cancelAtPeriodEnd: boolean };
}

const ACTIVE_STATUSES = new Set(["ACTIVE", "TRIALING"]);

export const FREE_ENTITLEMENTS: Entitlements = { tier: "FREE", features: FREE_FEATURES };

export function entitlementsFor(subscription: { tier: string; status: string; currentPeriodEnd: Date | null; cancelAtPeriodEnd: boolean } | null): Entitlements {
  if (!subscription || subscription.tier !== "PRO" || !ACTIVE_STATUSES.has(subscription.status)) {
    return subscription ? { ...FREE_ENTITLEMENTS, subscription } : FREE_ENTITLEMENTS;
  }
  return { tier: "PRO", features: PRO_FEATURES, subscription };
}

export async function getEntitlements(userId: string | null | undefined): Promise<Entitlements> {
  if (!userId || !env.database) return FREE_ENTITLEMENTS;
  const subscription = await getDb().premiumSubscription.findUnique({
    where: { userId },
    select: { tier: true, status: true, currentPeriodEnd: true, cancelAtPeriodEnd: true },
  });
  return entitlementsFor(subscription);
}

export function hasFeature(entitlements: Entitlements, feature: Feature): boolean {
  return entitlements.features.includes(feature);
}
