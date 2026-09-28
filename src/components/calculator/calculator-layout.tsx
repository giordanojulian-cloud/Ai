import Link from "next/link";
import { getCategory } from "@/calculators/categories";
import type { CalculatorContent, CalculatorMeta, FaqEntry } from "@/calculators/types";
import { CalculatorFeedback } from "@/components/feedback/calculator-feedback";
import { SuggestCalculatorForm } from "@/components/feedback/suggest-calculator-form";
import { AdSlot } from "@/components/monetization/ad-slot";
import { AffiliateCTA } from "@/components/monetization/affiliate-cta";
import { LeadGenBlock } from "@/components/monetization/lead-gen-block";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { CalculatorBreadcrumbs, type Crumb } from "./calculator-breadcrumbs";
import { CalculatorDisclaimer } from "./calculator-disclaimer";
import { CalculatorFAQ } from "./calculator-faq";
import { CalculatorWidget } from "./calculator-widget";
import { ContentBlocks } from "./content-blocks";
import { ContentSection } from "./content-section";
import { FormulaExplanation } from "./formula-explanation";
import { RelatedCalculators } from "./related-calculators";

interface CalculatorLayoutProps {
  meta: CalculatorMeta;
  content: CalculatorContent;
  faqs: FaqEntry[];
  breadcrumbs: Crumb[];
  related: CalculatorMeta[];
  features: { save: boolean; ai: boolean };
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/**
 * Page template shared by every calculator. The interactive calculator sits
 * directly under the H1; education follows, then FAQs and related tools.
 */
export function CalculatorLayout({ meta, content, faqs, breadcrumbs, related, features }: CalculatorLayoutProps) {
  const category = getCategory(meta.category);
  const toc = [
    { id: "what-it-means", label: "What this result means" },
    { id: "how-it-works", label: "How it works" },
    { id: "formula", label: "Formula" },
    { id: "example", label: "Example calculation" },
    ...content.guide.map((section) => ({ id: slugify(section.heading), label: section.heading })),
    { id: "assumptions", label: "Assumptions" },
    ...(faqs.length ? [{ id: "faq", label: "FAQ" }] : []),
  ];

  return (
    <Container className="py-6 sm:py-10">
      <CalculatorBreadcrumbs items={breadcrumbs} />

      <header className="mt-5 mb-8 max-w-3xl">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {category && (
            <Link href={`/category/${category.slug}`}>
              <Badge variant="outline">{category.name}</Badge>
            </Link>
          )}
          {meta.premium && <Badge variant="primary">Pro</Badge>}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{meta.name}</h1>
        <p className="mt-3 text-lg text-pretty text-muted-foreground">{meta.description}</p>
      </header>

      <CalculatorWidget
        slug={meta.slug}
        premium={meta.premium}
        name={meta.name}
        features={features}
        afterResult={
          <>
            <AdSlot placement="below-result" />
            <AffiliateCTA vertical={meta.affiliate} slug={meta.slug} />
          </>
        }
      />

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <article className="flex min-w-0 flex-col gap-12">
          <ContentSection id="what-it-means" title="What this result means">
            <ContentBlocks blocks={content.whatItMeans} />
          </ContentSection>

          <ContentSection id="how-it-works" title="How this calculator works">
            <ContentBlocks blocks={content.howItWorks} />
          </ContentSection>

          <ContentSection id="formula" title="Formula">
            <FormulaExplanation formulas={content.formulas} />
          </ContentSection>

          <ContentSection id="example" title="Example calculation">
            <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
              <h3 className="mb-3 font-semibold">{content.example.title}</h3>
              <ContentBlocks blocks={content.example.body} />
            </div>
          </ContentSection>

          <AdSlot placement="in-content" />

          {content.guide.map((section) => (
            <ContentSection key={section.heading} id={slugify(section.heading)} title={section.heading}>
              <ContentBlocks blocks={section.body} />
            </ContentSection>
          ))}

          <ContentSection id="assumptions" title="Assumptions">
            <ContentBlocks blocks={[{ list: content.assumptions }]} />
            {content.sources && content.sources.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Sources</p>
                <ul className="mt-1 list-disc pl-5">
                  {content.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} rel="noopener" className="text-primary underline-offset-4 hover:underline">
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </ContentSection>

          <LeadGenBlock vertical={meta.leadGen} />

          {faqs.length > 0 && (
            <ContentSection id="faq" title="Frequently asked questions">
              <CalculatorFAQ faqs={faqs} />
            </ContentSection>
          )}

          <CalculatorDisclaimer kind={meta.disclaimer} />

          <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-5 sm:p-6">
            <CalculatorFeedback slug={meta.slug} />
            <details className="border-t border-border pt-4">
              <summary className="cursor-pointer text-sm font-medium text-primary">Suggest a calculator</summary>
              <div className="mt-4 max-w-md">
                <SuggestCalculatorForm compact />
              </div>
            </details>
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-6">
            <nav aria-label="On this page">
              <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">On this page</p>
              <ul className="flex flex-col gap-2 border-l border-border text-sm">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="-ml-px block border-l border-transparent pl-3 text-muted-foreground hover:border-foreground hover:text-foreground">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <AdSlot placement="sidebar" />
          </div>
        </aside>
      </div>

      <div className="mt-16">
        <RelatedCalculators calculators={related} />
      </div>
    </Container>
  );
}
