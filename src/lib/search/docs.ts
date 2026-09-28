import { getCategory } from "@/calculators/categories";
import type { CalculatorMeta } from "@/calculators/types";
import type { SearchDoc } from "./index";

export function toSearchDoc(meta: CalculatorMeta): SearchDoc {
  return {
    slug: meta.slug,
    name: meta.name,
    shortDescription: meta.shortDescription,
    category: meta.category,
    categoryName: getCategory(meta.category)?.name ?? meta.category,
    keywords: meta.keywords,
    aliases: meta.searchAliases ?? [],
    popularity: meta.popularity ?? 1000,
  };
}
