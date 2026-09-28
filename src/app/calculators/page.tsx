import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/calculators/categories";
import { calculatorsInCategory, sortByName } from "@/calculators/registry";
import { CalculatorBreadcrumbs } from "@/components/calculator/calculator-breadcrumbs";
import { CalculatorLinkList } from "@/components/catalog/calculator-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/catalog";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "All Calculators",
  description: "Browse every calculator by category: mortgage, investing, debt, business, construction, career and everyday math tools.",
  path: "/calculators",
});

export default async function CalculatorsPage() {
  const catalog = await getCatalog();
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "All calculators", href: "/calculators" },
  ];
  return (
    <Container className="py-10">
      <CalculatorBreadcrumbs items={crumbs} />
      <header className="mt-5 mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">All calculators</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {catalog.length} calculators, each with the formula, assumptions and a worked example.
        </p>
        <nav aria-label="Jump to category" className="mt-5 flex flex-wrap gap-2">
          {categories.map((c) => (
            <a key={c.slug} href={`#${c.slug}`} className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground hover:text-foreground">
              {c.name}
            </a>
          ))}
        </nav>
      </header>
      <div className="grid gap-10 md:grid-cols-2">
        {categories.map((category) => {
          const items = sortByName(calculatorsInCategory(catalog, category.slug));
          return (
            <section key={category.slug} id={category.slug} aria-labelledby={`${category.slug}-h`} className="scroll-mt-24 rounded-xl border border-border bg-surface p-6">
              <div className="mb-4 flex items-baseline justify-between gap-2">
                <h2 id={`${category.slug}-h`} className="text-lg font-semibold">
                  <Link href={`/category/${category.slug}`} className="hover:text-primary">
                    {category.name}
                  </Link>
                </h2>
                <span className="text-xs text-subtle-foreground">{items.length}</span>
              </div>
              {items.length ? <CalculatorLinkList calculators={items} /> : <p className="text-sm text-muted-foreground">Coming soon.</p>}
            </section>
          );
        })}
      </div>
      <JsonLd data={[breadcrumbJsonLd(crumbs), itemListJsonLd("All calculators", sortByName(catalog).map((c) => ({ name: c.name, href: `/calculator/${c.slug}` })))]} />
    </Container>
  );
}
