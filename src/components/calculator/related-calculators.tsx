import Link from "next/link";
import type { CalculatorMeta } from "@/calculators/types";
import { CalculatorIcon } from "./calculator-icon";

export function RelatedCalculators({ calculators, title = "Related calculators" }: { calculators: CalculatorMeta[]; title?: string }) {
  if (!calculators.length) return null;
  return (
    <section aria-labelledby="related-heading" className="flex flex-col gap-4">
      <h2 id="related-heading" className="text-xl font-semibold tracking-tight">
        {title}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calculator) => (
          <li key={calculator.slug}>
            <Link
              href={`/calculator/${calculator.slug}`}
              className="flex h-full gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong hover:bg-surface-muted/50"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
                <CalculatorIcon name={calculator.icon} className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{calculator.name}</span>
                <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">{calculator.shortDescription}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
