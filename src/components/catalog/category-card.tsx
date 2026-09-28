import Link from "next/link";
import type { Category } from "@/calculators/categories";
import type { CalculatorIcon as IconName } from "@/calculators/types";
import { CalculatorIcon } from "@/components/calculator/calculator-icon";

export function CategoryCard({ category, count }: { category: Category; count: number }) {
  return (
    <Link href={`/category/${category.slug}`} className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-foreground">
        <CalculatorIcon name={category.icon as IconName} className="size-5" />
      </span>
      <span>
        <span className="block font-semibold group-hover:text-primary">{category.name}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">{category.shortDescription}</span>
        <span className="mt-2 block text-xs text-subtle-foreground">
          {count} {count === 1 ? "calculator" : "calculators"}
        </span>
      </span>
    </Link>
  );
}
