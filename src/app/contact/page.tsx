import type { Metadata } from "next";
import { SuggestCalculatorForm } from "@/components/feedback/suggest-calculator-form";
import { ProsePage } from "@/components/layout/prose-page";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: `Contact ${siteConfig.name} or suggest a new calculator.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <ProsePage title="Contact us" intro="Questions, corrections or partnership inquiries — we read everything.">
      <p>
        Email us at <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>. If you think a calculator returned an
        incorrect result, include the page link (use “Copy link” on the calculator) so we can reproduce it.
      </p>
      <h2 id="suggest" className="scroll-mt-24">
        Suggest a calculator
      </h2>
      <div className="not-prose mt-4">
        <SuggestCalculatorForm />
      </div>
    </ProsePage>
  );
}
