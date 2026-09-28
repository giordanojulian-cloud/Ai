import type { Metadata } from "next";
import { ProsePage } from "@/components/layout/prose-page";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description: `Terms of use, disclaimers and advertiser disclosure for ${siteConfig.name}.`,
  path: "/terms",
});

// TODO(legal): Have counsel review before launch.
export default function TermsPage() {
  return (
    <ProsePage title="Terms of use" updated="September 28, 2026">
      <h2>Educational use</h2>
      <p>
        {siteConfig.name} calculators provide estimates for educational and informational purposes. Results depend on the inputs and
        assumptions you provide and on the formulas described on each page. Actual costs, rates and outcomes can differ.
      </p>
      <h2>No professional advice</h2>
      <p>
        Nothing on this site is financial, tax, legal, lending, real estate or investment advice. Consult a qualified professional before
        making decisions based on a calculation.
      </p>
      <h2>Accuracy</h2>
      <p>
        We test our formulas carefully, but we cannot guarantee that every result is free from error or suitable for your situation. Rules
        such as loan program requirements and tax rates change; where we rely on them, we note the effective date and source.
      </p>
      <h2 id="affiliate-disclosure" className="scroll-mt-24">
        Advertiser disclosure
      </h2>
      <p>
        {siteConfig.name} may earn compensation when you click on or are approved for products from partners featured on the site.
        Compensation never influences calculator formulas or results. Sponsored placements are always labeled.
      </p>
      <h2>Accounts</h2>
      <p>You are responsible for activity on your account. We may suspend accounts that abuse the service or attempt to disrupt it.</p>
    </ProsePage>
  );
}
