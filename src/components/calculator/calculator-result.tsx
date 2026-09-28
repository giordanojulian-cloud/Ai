import type { CalculatorResult as Result, ResultValue } from "@/calculators/types";
import { formatValue } from "@/lib/format";
import { cn } from "@/lib/utils";

const toneClass = {
  default: "text-foreground",
  positive: "text-positive",
  negative: "text-negative",
} as const;

function Metric({ item }: { item: ResultValue }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg bg-surface-muted/60 px-3 py-2.5">
      <dt className="text-xs text-muted-foreground">{item.label}</dt>
      <dd className={cn("tabular text-base font-semibold tracking-tight", toneClass[item.tone ?? "default"])}>
        {formatValue(item.value, item.format)}
      </dd>
      {item.hint && <dd className="text-xs text-subtle-foreground">{item.hint}</dd>}
    </div>
  );
}

/** Primary result, secondary metrics and labeled sections. Pure presentation. */
export function CalculatorResult({ result, stale }: { result: Result; stale?: boolean }) {
  const { primary } = result;
  return (
    <div className={cn("flex flex-col gap-5 transition-opacity", stale && "opacity-50")}>
      <div className="rounded-xl bg-primary-soft px-5 py-5">
        <p className="text-sm font-medium text-primary-soft-foreground">{primary.label}</p>
        <p
          data-testid="primary-result"
          className={cn("tabular mt-1 text-4xl font-semibold tracking-tight sm:text-5xl", primary.tone ? toneClass[primary.tone] : "text-foreground")}
        >
          {formatValue(primary.value, primary.format)}
        </p>
        {primary.hint && <p className="mt-1 text-sm text-muted-foreground">{primary.hint}</p>}
      </div>

      {result.secondary.length > 0 && (
        <dl className="grid grid-cols-2 gap-2">
          {result.secondary.map((item) => (
            <Metric key={item.label} item={item} />
          ))}
        </dl>
      )}

      {result.sections?.map((section) => (
        <section key={section.title} aria-label={section.title} className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">{section.title}</h3>
          {section.description && <p className="text-xs text-muted-foreground">{section.description}</p>}
          <dl className="grid grid-cols-2 gap-2">
            {section.items.map((item) => (
              <Metric key={item.label} item={item} />
            ))}
          </dl>
        </section>
      ))}

      {result.warnings && result.warnings.length > 0 && (
        <ul className="flex flex-col gap-2">
          {result.warnings.map((warning) => (
            <li key={warning} className="rounded-lg border border-warning/30 bg-warning-soft px-3 py-2 text-sm">
              {warning}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ResultInsights({ insights }: { insights?: string[] }) {
  if (!insights?.length) return null;
  return (
    <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
      {insights.map((insight) => (
        <li key={insight} className="flex gap-2">
          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
          <span>{insight}</span>
        </li>
      ))}
    </ul>
  );
}
