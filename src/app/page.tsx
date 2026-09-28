import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/calculators/categories";
import { calculatorsInCategory, inCategory, sortByPopularity, sortByRecent } from "@/calculators/registry";
import { CalculatorGrid } from "@/components/catalog/calculator-card";
import { CategoryCard } from "@/components/catalog/category-card";
import { Section } from "@/components/catalog/section";
import { SearchCombobox } from "@/components/search/search-combobox";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { getCatalog } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name}: Free Financial, Business & Real Estate Calculators`,
  description: `${siteConfig.description} Every calculator shows its formula, assumptions and a worked example.`,
  path: "/",
  absoluteTitle: true,
});

const SUGGESTIONS = [
  { label: "Mortgage payment", href: "/calculator/mortgage" },
  { label: "How much house can I afford?", href: "/calculator/mortgage-affordability" },
  { label: "Compound interest", href: "/calculator/compound-interest" },
  { label: "Profit margin", href: "/calculator/profit-margin" },
];

const PRINCIPLES = [
  { title: "Formulas shown", body: "Every result comes with the exact formula, assumptions and a worked example." },
  { title: "Instant and private", body: "Calculations run in your browser. No sign-up, and we never sell your inputs." },
  { title: "Built for decisions", body: "Clear explanations, charts and schedules — not just a single number." },
];

export default async function HomePage() {
  const catalog = await getCatalog();
  const popular = sortByPopularity(catalog).slice(0, 8);
  const section = (slug: Parameters<typeof calculatorsInCategory>[1], limit = 4) => calculatorsInCategory(catalog, slug).slice(0, limit);
  const financial = sortByPopularity(catalog.filter((c) => inCategory(c, "finance") || inCategory(c, "investing") || inCategory(c, "debt"))).slice(0, 8);

  return (
    <>
      <section className="border-b border-border">
        <Container className="flex flex-col items-center py-16 text-center sm:py-24">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-display">{siteConfig.tagline}</h1>
          <p className="mt-5 max-w-2xl text-lg text-pretty text-muted-foreground">{siteConfig.description}</p>
          <div className="mt-8 w-full max-w-2xl text-left">
            <SearchCombobox location="home" size="lg" />
          </div>
          <ul className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Popular searches">
            {SUGGESTIONS.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="inline-flex rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted-foreground hover:border-border-strong hover:text-foreground">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="flex flex-col gap-20 py-16">
        <Section id="popular" title="Popular calculators" description="The tools people use most." href="/calculators" linkLabel="All calculators">
          <CalculatorGrid calculators={popular} />
        </Section>

        <Section id="financial" title="Financial calculators" description="Interest, investing, savings and debt." href="/category/finance" linkLabel="All finance">
          <CalculatorGrid calculators={financial} />
        </Section>

        <Section id="business" title="Business calculators" description="Pricing, margins, break-even and valuation." href="/category/business" linkLabel="All business">
          <CalculatorGrid calculators={section("business")} />
        </Section>

        <Section id="real-estate" title="Real estate calculators" description="Mortgages, affordability and rental analysis." href="/category/real-estate" linkLabel="All real estate">
          <CalculatorGrid calculators={section("real-estate", 8)} />
        </Section>

        <Section id="construction" title="Construction calculators" description="Materials and project estimates." href="/category/construction" linkLabel="All construction">
          <CalculatorGrid calculators={section("construction")} />
        </Section>

        <section aria-label="Why use these calculators" className="grid gap-6 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-3 sm:p-10">
          {PRINCIPLES.map((p) => (
            <div key={p.title}>
              <h2 className="font-semibold">{p.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </section>

        <Section id="recent" title="Recently added">
          <CalculatorGrid calculators={sortByRecent(catalog).slice(0, 4)} />
        </Section>

        <Section id="categories" title="Browse all categories">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <li key={category.slug}>
                <CategoryCard category={category} count={catalog.filter((c) => inCategory(c, category.slug)).length} />
              </li>
            ))}
          </ul>
        </Section>
      </Container>
    </>
  );
}
