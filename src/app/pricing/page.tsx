import type { Metadata } from "next";
import { Check } from "lucide-react";
import Link from "next/link";
import { UpgradeButton } from "@/components/account/billing-buttons";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { features } from "@/lib/env";
import { PLANS } from "@/lib/billing/plans";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description: `Every ${siteConfig.name} calculator is free. Pro adds unlimited saved calculations, advanced scenarios, reports and no ads.`,
  path: "/pricing",
});

export default function PricingPage() {
  const billingLive = features.stripe;
  const plans = [PLANS.free, PLANS.pro_monthly, PLANS.pro_annual];
  return (
    <Container className="py-16">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Simple pricing</h1>
        <p className="mt-3 text-lg text-muted-foreground">Every calculator is free. Pro is for people who come back to plan, compare and share.</p>
        {!billingLive && (
          <Badge variant="warning" className="mt-4">
            Pro is coming soon
          </Badge>
        )}
      </header>
      <ul className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <li key={plan.id} className={`flex flex-col gap-5 rounded-2xl border bg-surface p-6 ${plan.id === "pro_annual" ? "border-primary" : "border-border"}`}>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{plan.name}</h2>
                {plan.id === "pro_annual" && <Badge variant="primary">Best value</Badge>}
              </div>
              <p className="mt-3">
                <span className="text-4xl font-semibold tracking-tight">{plan.priceLabel}</span>
                {plan.interval && <span className="text-muted-foreground"> / {plan.interval}</span>}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
            </div>
            <ul className="flex flex-1 flex-col gap-2 text-sm">
              {plan.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-positive" />
                  {h}
                </li>
              ))}
            </ul>
            {plan.id === "free" ? (
              <Link href="/calculators" className={buttonVariants({ variant: "outline" })}>
                Browse calculators
              </Link>
            ) : (
              <UpgradeButton plan={plan.id} disabled={!billingLive} variant={plan.id === "pro_annual" ? "primary" : "outline"}>
                {billingLive ? `Get ${plan.name}` : "Coming soon"}
              </UpgradeButton>
            )}
          </li>
        ))}
      </ul>
    </Container>
  );
}
