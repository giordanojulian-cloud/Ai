import type { Metadata } from "next";
import Link from "next/link";
import { valuesFromSearchParams, valuesToSearchParams } from "@/calculators/engine/values";
import { calculatorMetas, findCalculator, loadCalculatorDefinition } from "@/calculators/registry";
import type { CalculatorValues } from "@/calculators/types";
import { SavedCalculationItem, type SavedItem } from "@/components/account/saved-calculation-item";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { requireUser } from "@/lib/auth/session";
import { FREE_SAVED_CALCULATION_LIMIT } from "@/lib/billing/plans";
import { getEntitlements, hasFeature } from "@/lib/billing/entitlements";
import { getDb } from "@/lib/db";
import { features } from "@/lib/env";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({ title: "Dashboard", description: "Your saved calculations.", path: "/dashboard", noIndex: true });

async function toItem(row: { id: string; name: string; calculatorSlug: string; inputs: unknown; updatedAt: Date }): Promise<SavedItem | null> {
  const meta = findCalculator(calculatorMetas, row.calculatorSlug);
  const definition = await loadCalculatorDefinition(row.calculatorSlug);
  if (!meta || !definition) return null;
  // Re-serialize through the definition so stale/unknown keys never reach the URL.
  const stored = new URLSearchParams(valuesToSearchParams(definition, (row.inputs ?? {}) as CalculatorValues));
  const { values } = valuesFromSearchParams(definition, stored);
  return {
    id: row.id,
    name: row.name,
    calculatorName: meta.name,
    href: `/calculator/${meta.slug}?${valuesToSearchParams(definition, values).toString()}`,
    updatedAt: row.updatedAt.toLocaleDateString("en-US", { dateStyle: "medium" }),
  };
}

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");

  if (!features.database) {
    return (
      <Container className="max-w-3xl py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <Alert className="mt-6">Saved calculations need a database. Set DATABASE_URL to enable them.</Alert>
      </Container>
    );
  }

  const [rows, entitlements] = await Promise.all([
    getDb().savedCalculation.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" }, take: 200 }),
    getEntitlements(user.id),
  ]);
  const items = (await Promise.all(rows.map(toItem))).filter((i): i is SavedItem => i !== null);
  const unlimited = hasFeature(entitlements, "unlimited_saves");

  return (
    <Container className="max-w-3xl py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
          Saved calculations <Badge>Beta</Badge>
        </h1>
        <Link href="/account" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Account
        </Link>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {unlimited ? `${items.length} saved` : `${items.length} of ${FREE_SAVED_CALCULATION_LIMIT} saved on the free plan`}. We store only calculator inputs; results are recalculated when you open them.
      </p>
      {items.length ? (
        <ul className="mt-8 divide-y divide-border rounded-xl border border-border bg-surface px-5">
          {items.map((item) => (
            <SavedCalculationItem key={item.id} item={item} />
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-border-strong p-8 text-center">
          <p className="font-medium">No saved calculations yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Use the Save button on any calculator to keep a scenario here.</p>
          <Link href="/calculators" className={buttonVariants({ className: "mt-4" })}>
            Browse calculators
          </Link>
        </div>
      )}
    </Container>
  );
}
