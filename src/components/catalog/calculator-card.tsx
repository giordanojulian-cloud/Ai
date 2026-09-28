import Link from "next/link";
import type { CalculatorMeta } from "@/calculators/types";
import { CalculatorIcon } from "@/components/calculator/calculator-icon";
import { Badge } from "@/components/ui/badge";

export function CalculatorCard({ calculator }: { calculator: CalculatorMeta }) {
  return (
    <Link
      href={`/calculator/${calculator.slug}`}
      className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-strong hover:bg-surface-muted/40"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
          <CalculatorIcon name={calculator.icon} className="size-4" />
        </span>
        {calculator.premium && <Badge variant="primary">Pro</Badge>}
      </div>
      <div>
        <h3 className="font-semibold tracking-tight group-hover:text-primary">{calculator.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{calculator.shortDescription}</p>
      </div>
    </Link>
  );
}

export function CalculatorGrid({ calculators }: { calculators: CalculatorMeta[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {calculators.map((calculator) => (
        <li key={calculator.slug}>
          <CalculatorCard calculator={calculator} />
        </li>
      ))}
    </ul>
  );
}

/** Compact text list used for dense directories. */
export function CalculatorLinkList({ calculators }: { calculators: CalculatorMeta[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {calculators.map((calculator) => (
        <li key={calculator.slug}>
          <Link href={`/calculator/${calculator.slug}`} className="text-sm text-muted-foreground hover:text-primary">
            {calculator.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
