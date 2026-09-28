import type { MetadataRoute } from "next";
import { categories } from "@/calculators/categories";
import { calculatorsInCategory } from "@/calculators/registry";
import { absoluteUrl } from "@/config/site";
import { getCatalog } from "@/lib/catalog";

export const revalidate = 3600;

/** Includes every published calculator automatically; empty categories are left out to avoid thin pages. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog();
  const staticPages = ["/", "/calculators", "/about", "/contact", "/pricing", "/privacy", "/terms"].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.5,
  }));
  const categoryPages = categories
    .filter((c) => calculatorsInCategory(catalog, c.slug).length > 0)
    .map((c) => ({ url: absoluteUrl(`/category/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.7 }));
  const calculatorPages = catalog.map((c) => ({
    url: absoluteUrl(`/calculator/${c.slug}`),
    lastModified: new Date(c.updatedAt ?? c.addedAt),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));
  return [...staticPages, ...categoryPages, ...calculatorPages];
}
