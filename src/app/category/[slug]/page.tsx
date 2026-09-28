import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/calculators/categories";
import { calculatorsInCategory } from "@/calculators/registry";
import { CalculatorBreadcrumbs } from "@/components/calculator/calculator-breadcrumbs";
import { CalculatorGrid } from "@/components/catalog/calculator-card";
import { CategoryCard } from "@/components/catalog/category-card";
import { SuggestCalculatorForm } from "@/components/feedback/suggest-calculator-form";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/catalog";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const count = calculatorsInCategory(await getCatalog(), category.slug).length;
  return buildMetadata({
    title: category.title,
    description: category.description,
    path: `/category/${category.slug}`,
    // Avoid thin content: empty categories stay out of the index until they have tools.
    noIndex: count === 0,
  });
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const catalog = await getCatalog();
  const items = calculatorsInCategory(catalog, category.slug);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: category.name, href: `/category/${category.slug}` },
  ];

  return (
    <Container className="py-10">
      <CalculatorBreadcrumbs items={crumbs} />
      <header className="mt-5 mb-10 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{category.title}</h1>
        <div className="mt-4 flex flex-col gap-3 text-lg text-muted-foreground">
          {category.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </header>

      {items.length ? (
        <CalculatorGrid calculators={items} />
      ) : (
        <div className="max-w-lg rounded-xl border border-border bg-surface p-6">
          <h2 className="font-semibold">Calculators coming soon</h2>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">Tell us which {category.name.toLowerCase()} calculator you need.</p>
          <SuggestCalculatorForm compact />
        </div>
      )}

      <section aria-labelledby="other-categories" className="mt-16">
        <h2 id="other-categories" className="mb-6 text-xl font-semibold tracking-tight">
          Other categories
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories
            .filter((c) => c.slug !== category.slug)
            .map((c) => (
              <li key={c.slug}>
                <CategoryCard category={c} count={calculatorsInCategory(catalog, c.slug).length} />
              </li>
            ))}
        </ul>
      </section>
      <JsonLd data={[breadcrumbJsonLd(crumbs), itemListJsonLd(category.title, items.map((c) => ({ name: c.name, href: `/calculator/${c.slug}` })))]} />
    </Container>
  );
}
