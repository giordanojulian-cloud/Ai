import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory } from "@/calculators/categories";
import { calculatorMetas, findCalculator, loadCalculatorContent, relatedCalculators } from "@/calculators/registry";
import { CalculatorLayout } from "@/components/calculator/calculator-layout";
import { JsonLd } from "@/components/seo/json-ld";
import { getCatalog } from "@/lib/catalog";
import { features } from "@/lib/env";
import { breadcrumbJsonLd, calculatorJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

// Every calculator is statically generated; admin edits revalidate on demand.
export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return calculatorMetas.map((meta) => ({ slug: meta.slug }));
}

async function getEntry(slug: string) {
  return findCalculator(await getCatalog(), slug);
}

export async function generateMetadata({ params }: PageProps<"/calculator/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getEntry(slug);
  if (!meta) return {};
  return buildMetadata({
    title: meta.seoTitle,
    description: meta.seoDescription,
    path: `/calculator/${meta.slug}`,
    keywords: meta.keywords,
  });
}

export default async function CalculatorPage({ params }: PageProps<"/calculator/[slug]">) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const meta = findCalculator(catalog, slug);
  const content = meta && (await loadCalculatorContent(slug));
  if (!meta || !content) notFound();

  const category = getCategory(meta.category);
  const breadcrumbs = [
    { name: "Home", href: "/" },
    ...(category ? [{ name: category.name, href: `/category/${category.slug}` }] : []),
    { name: meta.name, href: `/calculator/${meta.slug}` },
  ];
  const faqs = meta.faqOverride ?? content.faqs;

  return (
    <>
      <CalculatorLayout
        meta={meta}
        content={content}
        faqs={faqs}
        breadcrumbs={breadcrumbs}
        related={relatedCalculators(catalog, meta)}
        features={{ save: features.database && features.auth, ai: features.ai }}
      />
      <JsonLd data={[calculatorJsonLd(meta), breadcrumbJsonLd(breadcrumbs), faqJsonLd(faqs)]} />
    </>
  );
}
