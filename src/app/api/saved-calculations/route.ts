import { NextResponse } from "next/server";
import { z } from "zod";
import { loadCalculatorDefinition } from "@/calculators/registry";
import { validateValues } from "@/calculators/engine/values";
import { getCurrentUser } from "@/lib/auth/session";
import { FREE_SAVED_CALCULATION_LIMIT } from "@/lib/billing/plans";
import { getEntitlements, hasFeature } from "@/lib/billing/entitlements";
import { getDb } from "@/lib/db";
import { handleRouteError, jsonError, parseJsonRequest } from "@/lib/http";
import { rateLimiters } from "@/lib/rate-limit";

const schema = z.object({
  calculatorSlug: z.string().max(100),
  name: z.string().trim().min(1).max(120),
  inputs: z.record(z.string(), z.union([z.number(), z.string(), z.boolean()])),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError(401, "Sign in to view saved calculations.");
  try {
    const items = await getDb().savedCalculation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true, calculatorSlug: true, name: true, inputs: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json({ items });
  } catch (error) {
    return handleRouteError(error, "saved-calculations:list");
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError(401, "Sign in to save calculations.");
  const parsed = await parseJsonRequest(request, schema, { limiter: rateLimiters.writes, limiterKey: `save:${user.id}` });
  if (!parsed.ok) return parsed.response;

  // Server-side validation: only well-formed inputs for a real calculator are stored.
  const definition = await loadCalculatorDefinition(parsed.data.calculatorSlug);
  if (!definition) return jsonError(404, "Unknown calculator.");
  const validation = validateValues(definition, parsed.data.inputs);
  if (!validation.ok) return jsonError(400, "These inputs aren't valid for this calculator.");

  try {
    const db = getDb();
    const entitlements = await getEntitlements(user.id);
    if (!hasFeature(entitlements, "unlimited_saves")) {
      const count = await db.savedCalculation.count({ where: { userId: user.id } });
      if (count >= FREE_SAVED_CALCULATION_LIMIT) {
        return jsonError(403, `The free plan saves up to ${FREE_SAVED_CALCULATION_LIMIT} calculations. Delete one or upgrade to Pro.`, { code: "limit_reached" });
      }
    }
    const saved = await db.savedCalculation.create({
      data: { userId: user.id, calculatorSlug: parsed.data.calculatorSlug, name: parsed.data.name, inputs: validation.values },
      select: { id: true },
    });
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "saved-calculations:create");
  }
}
