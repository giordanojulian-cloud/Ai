import Link from "next/link";
import type { AffiliateVertical } from "@/calculators/types";
import { affiliateOffers, affiliateVerticalLabels, monetizationPreview } from "@/config/monetization";
import { buttonVariants } from "@/components/ui/button";
import { AffiliateLink } from "./tracked-link";

export function AffiliateDisclosure() {
  return (
    <p className="text-xs text-subtle-foreground">
      We may earn a commission from partners, which never affects our calculations.{" "}
      <Link href="/terms#affiliate-disclosure" className="underline underline-offset-2">
        Advertiser disclosure
      </Link>
    </p>
  );
}

/** Contextual partner offers for a vertical. Renders nothing when no offers are configured. */
export function AffiliateCTA({ vertical, slug }: { vertical?: AffiliateVertical; slug?: string }) {
  if (!vertical) return null;
  const offers = affiliateOffers[vertical];
  if (!offers.length && !monetizationPreview) return null;

  return (
    <aside aria-label="Sponsored offers" className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{affiliateVerticalLabels[vertical]}</h2>
        <span className="text-[10px] font-medium tracking-wider text-subtle-foreground uppercase">Sponsored</span>
      </div>
      {offers.length ? (
        <ul className="flex flex-col gap-3">
          {offers.map((offer) => (
            <li key={offer.partner} className="flex flex-col gap-2 rounded-lg bg-surface-muted/60 p-3">
              <p className="text-sm font-medium">{offer.headline}</p>
              <p className="text-xs text-muted-foreground">{offer.description}</p>
              <AffiliateLink href={offer.url} vertical={vertical} partner={offer.partner} slug={slug} className={buttonVariants({ size: "sm", className: "self-start" })}>
                {offer.cta}
              </AffiliateLink>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-border-strong p-3 text-xs text-subtle-foreground">
          Affiliate placeholder · configure offers for “{vertical}” in src/config/monetization.ts
        </p>
      )}
      <AffiliateDisclosure />
    </aside>
  );
}
