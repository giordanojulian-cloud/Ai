import type { Metadata } from "next";
import Link from "next/link";
import { sortByPopularity } from "@/calculators/registry";
import { CalculatorGrid } from "@/components/catalog/calculator-card";
import { SuggestCalculatorForm } from "@/components/feedback/suggest-calculator-form";
import { SearchCombobox } from "@/components/search/search-combobox";
import { Container } from "@/components/ui/container";
import { getCatalog } from "@/lib/catalog";
import { searchCalculators } from "@/lib/search";
import { toSearchDoc } from "@/lib/search/docs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Search Calculators",
  description: "Search every calculator by name, topic or question.",
  path: "/search",
  noIndex: true, // Search result pages shouldn't be indexed.
});

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const raw = (await searchParams).q;
  const query = (Array.isArray(raw) ? raw[0] : raw)?.trim().slice(0, 100) ?? "";
  const catalog = await getCatalog();
  const hits = query ? searchCalculators(catalog.map(toSearchDoc), query, 30) : [];
  const bySlug = new Map(catalog.map((c) => [c.slug, c]));
  const results = hits.map((hit) => bySlug.get(hit.doc.slug)!).filter(Boolean);

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Search calculators</h1>
      <div className="mt-6 max-w-2xl">
        <SearchCombobox location="page" size="lg" initialQuery={query} />
      </div>
      <div className="mt-10" aria-live="polite">
        {query ? (
          results.length ? (
            <>
              <p className="mb-5 text-sm text-muted-foreground">
                {results.length} {results.length === 1 ? "result" : "results"} for “{query}”
              </p>
              <CalculatorGrid calculators={results} />
            </>
          ) : (
            <div className="max-w-lg">
              <p className="text-lg font-medium">No calculators match “{query}”.</p>
              <p className="mt-1 mb-6 text-muted-foreground">
                Try a broader term, <Link href="/calculators" className="text-primary hover:underline">browse all calculators</Link>, or tell us what to build.
              </p>
              <SuggestCalculatorForm />
            </div>
          )
        ) : (
          <>
            <h2 className="mb-5 text-lg font-semibold">Popular calculators</h2>
            <CalculatorGrid calculators={sortByPopularity(catalog).slice(0, 8)} />
          </>
        )}
      </div>
    </Container>
  );
}
