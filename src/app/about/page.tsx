import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/layout/prose-page";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: `Why we built ${siteConfig.name}: accurate calculators with transparent formulas and clear explanations.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <ProsePage title={`About ${siteConfig.name}`} intro="Better calculators, better explanations, better experience.">
      <p>
        Most online calculators give you a number and nothing else. We think the number is only half the answer. The other half is
        understanding where it came from, which inputs matter most, and what the result means for your decision.
      </p>
      <h2>How we build calculators</h2>
      <ul>
        <li>Every calculator uses an explicit, documented formula — never a guess that merely sounds reasonable.</li>
        <li>Assumptions are listed on the page. Where rules change over time, like FHA mortgage insurance or payroll taxes, we date them and cite the source.</li>
        <li>Each formula is covered by automated tests with known reference values, so results stay correct as the site grows.</li>
        <li>Calculations run in your browser, instantly, with no account required.</li>
      </ul>
      <h2>What we don’t do</h2>
      <p>
        We don’t give financial, tax, legal, lending or investment advice. Our tools explain calculations so you can have better
        conversations with the professionals who do.
      </p>
      <p>
        Have an idea for a calculator we should build? <Link href="/contact#suggest">Tell us</Link>.
      </p>
    </ProsePage>
  );
}
