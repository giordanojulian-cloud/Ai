import Link from "next/link";
import { notFound } from "next/navigation";
import { resetCalculatorOverrides } from "@/app/admin/actions";
import { categories } from "@/calculators/categories";
import { calculatorMetas, findCalculator, loadCalculatorContent } from "@/calculators/registry";
import { CalculatorEditForm } from "@/components/admin/calculator-edit-form";
import { Button } from "@/components/ui/button";
import { getFullCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function EditCalculator({ params }: PageProps<"/admin/calculators/[slug]">) {
  const { slug } = await params;
  const entry = findCalculator(await getFullCatalog(), slug);
  const content = await loadCalculatorContent(slug);
  if (!entry || !content) notFound();
  const faqs = entry.faqOverride ?? [];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Edit {entry.name}</h1>
        <CalculatorEditForm
          values={{
            slug,
            name: entry.name,
            shortDescription: entry.shortDescription,
            description: entry.description,
            seoTitle: entry.seoTitle,
            seoDescription: entry.seoDescription,
            keywords: entry.keywords.join(", "),
            category: entry.category,
            related: entry.related.join(", "),
            faqs: faqs.map((f) => `${f.question}\n${f.answer}`).join("\n\n"),
            featured: Boolean(entry.featured),
            premium: Boolean(entry.premium),
            published: (entry.status ?? "published") === "published",
          }}
          categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
          calculators={calculatorMetas.map((m) => m.slug).filter((s) => s !== slug)}
        />
      </div>
      <aside className="flex flex-col gap-4 text-sm">
        <Link href={`/calculator/${slug}`} className="text-primary hover:underline">
          View live page →
        </Link>
        <p className="text-muted-foreground">
          Calculation logic and long-form content live in code at <code>src/calculators/definitions/{slug}</code>. {content.faqs.length} FAQs are defined in code.
        </p>
        <form action={resetCalculatorOverrides.bind(null, slug)}>
          <Button type="submit" variant="outline" size="sm">
            Reset to code defaults
          </Button>
        </form>
      </aside>
    </div>
  );
}
