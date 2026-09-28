import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { FREE_ENTITLEMENTS, getEntitlements } from "@/lib/billing/entitlements";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser().catch(() => null);
  const entitlements = user ? await getEntitlements(user.id).catch(() => FREE_ENTITLEMENTS) : FREE_ENTITLEMENTS;
  return NextResponse.json({ tier: entitlements.tier, features: entitlements.features }, { headers: { "Cache-Control": "private, no-store" } });
}
