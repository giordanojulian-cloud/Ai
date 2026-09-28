"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { calculatorWidgets } from "@/calculators/widgets.generated";
import { buttonVariants } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import type { BoundCalculatorProps } from "./calculator-engine";

/**
 * Client entry point for a calculator. Looks up the lazily-loaded widget for
 * `slug`. Premium calculators check entitlements first; note this gate is a
 * UX boundary — anything truly paid (exports, saved history) is enforced by
 * the API.
 */
export function CalculatorWidget({ slug, premium, ...props }: BoundCalculatorProps & { slug: string; premium?: boolean }) {
  const Widget = calculatorWidgets[slug];
  const [access, setAccess] = useState<"checking" | "granted" | "denied">(premium ? "checking" : "granted");

  useEffect(() => {
    if (!premium) return;
    fetch("/api/entitlements")
      .then((response) => (response.ok ? response.json() : { features: [] }))
      .then((data: { features: string[] }) => setAccess(data.features.includes("premium_calculators") ? "granted" : "denied"))
      .catch(() => setAccess("denied"));
  }, [premium]);

  if (!Widget) return null;
  if (access === "denied") {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">This is a Pro calculator</h2>
        <p className="text-sm text-muted-foreground">Upgrade to Pro to use advanced calculators, scenario comparisons and exports.</p>
        <Link href="/pricing" onClick={() => track("premium_clicked", { plan: "pro", location: `calculator:${slug}` })} className={buttonVariants()}>
          See Pro plans
        </Link>
      </div>
    );
  }
  return <Widget {...props} />;
}
