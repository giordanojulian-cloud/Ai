import { cache } from "react";
import { unstable_cache } from "next/cache";
import { isCategorySlug } from "@/calculators/categories";
import { calculatorMetas, isPublished } from "@/calculators/registry";
import type { CalculatorMeta, FaqEntry } from "@/calculators/types";
import { features } from "./env";
import { getDb } from "./db";

/** A calculator's metadata after admin overrides have been applied. */
export interface CatalogEntry extends CalculatorMeta {
  /** When set by an admin, replaces the FAQs defined in content.ts. */
  faqOverride?: FaqEntry[];
}

export const CATALOG_CACHE_TAG = "calculator-catalog";

interface Override {
  slug: string;
  name: string | null;
  shortDescription: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  keywords: string[];
  featured: boolean | null;
  premium: boolean | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | null;
  faqs: unknown;
  relatedSlugs: string[];
  categorySlug: string | null;
}

function parseFaqs(value: unknown): FaqEntry[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const faqs = value.filter(
    (item): item is FaqEntry =>
      typeof item === "object" && item !== null && typeof item.question === "string" && typeof item.answer === "string",
  );
  return faqs.length ? faqs : undefined;
}

export function applyOverride(meta: CalculatorMeta, o: Override | undefined): CatalogEntry {
  if (!o) return meta;
  return {
    ...meta,
    name: o.name ?? meta.name,
    shortDescription: o.shortDescription ?? meta.shortDescription,
    description: o.description ?? meta.description,
    seoTitle: o.seoTitle ?? meta.seoTitle,
    seoDescription: o.seoDescription ?? meta.seoDescription,
    keywords: o.keywords.length ? o.keywords : meta.keywords,
    category: o.categorySlug && isCategorySlug(o.categorySlug) ? o.categorySlug : meta.category,
    featured: o.featured ?? meta.featured,
    premium: o.premium ?? meta.premium,
    status: o.status ? (o.status === "PUBLISHED" ? "published" : "draft") : meta.status,
    related: o.relatedSlugs.length ? o.relatedSlugs : meta.related,
    faqOverride: parseFaqs(o.faqs),
  };
}

async function loadOverrides(): Promise<Override[]> {
  if (!features.database) return [];
  try {
    const rows = await getDb().calculator.findMany({ include: { category: { select: { slug: true } } } });
    return rows.map((row) => ({ ...row, categorySlug: row.category?.slug ?? null }));
  } catch (error) {
    // The public site must keep working from code defaults if the DB is unreachable.
    console.error("[catalog] Falling back to code defaults; could not load overrides:", error);
    return [];
  }
}

const cachedOverrides = unstable_cache(loadOverrides, ["calculator-overrides"], {
  tags: [CATALOG_CACHE_TAG],
  revalidate: 3600,
});

/** Every code-defined calculator merged with admin overrides (including drafts). */
export const getFullCatalog = cache(async (): Promise<CatalogEntry[]> => {
  const overrides = await cachedOverrides();
  const bySlug = new Map(overrides.map((o) => [o.slug, o]));
  return calculatorMetas.map((meta) => applyOverride(meta, bySlug.get(meta.slug)));
});

/** Published calculators only — what the public site lists. */
export const getCatalog = cache(async (): Promise<CatalogEntry[]> => (await getFullCatalog()).filter(isPublished));
