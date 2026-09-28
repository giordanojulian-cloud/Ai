"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { FREE_SAVED_CALCULATION_LIMIT } from "@/lib/billing/plans";
import { getEntitlements, hasFeature } from "@/lib/billing/entitlements";
import { getDb } from "@/lib/db";

export type ActionResult = { ok: true } | { ok: false; error: string };

const idSchema = z.string().min(1).max(50);

/** Every action re-checks the session and scopes queries to the owner. */
async function ownerId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in.");
  return user.id;
}

export async function renameSavedCalculation(id: string, name: string): Promise<ActionResult> {
  const parsed = z.object({ id: idSchema, name: z.string().trim().min(1).max(120) }).safeParse({ id, name });
  if (!parsed.success) return { ok: false, error: "Enter a name up to 120 characters." };
  const userId = await ownerId();
  const { count } = await getDb().savedCalculation.updateMany({ where: { id: parsed.data.id, userId }, data: { name: parsed.data.name } });
  revalidatePath("/dashboard");
  return count ? { ok: true } : { ok: false, error: "Calculation not found." };
}

export async function deleteSavedCalculation(id: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return { ok: false, error: "Invalid id." };
  const userId = await ownerId();
  await getDb().savedCalculation.deleteMany({ where: { id, userId } });
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function duplicateSavedCalculation(id: string): Promise<ActionResult> {
  if (!idSchema.safeParse(id).success) return { ok: false, error: "Invalid id." };
  const userId = await ownerId();
  const db = getDb();
  const source = await db.savedCalculation.findFirst({ where: { id, userId } });
  if (!source) return { ok: false, error: "Calculation not found." };
  if (!hasFeature(await getEntitlements(userId), "unlimited_saves")) {
    if ((await db.savedCalculation.count({ where: { userId } })) >= FREE_SAVED_CALCULATION_LIMIT) {
      return { ok: false, error: `The free plan saves up to ${FREE_SAVED_CALCULATION_LIMIT} calculations.` };
    }
  }
  await db.savedCalculation.create({
    data: { userId, calculatorSlug: source.calculatorSlug, name: `${source.name} (copy)`.slice(0, 120), inputs: source.inputs ?? {} },
  });
  revalidatePath("/dashboard");
  return { ok: true };
}
