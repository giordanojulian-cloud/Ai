import type { FormulaSpec } from "@/calculators/types";

export function FormulaExplanation({ formulas }: { formulas: FormulaSpec[] }) {
  if (!formulas.length) return null;
  return (
    <div className="flex flex-col gap-4">
      {formulas.map((formula) => (
        <div key={formula.label} className="rounded-lg border border-border bg-surface p-4">
          <p className="text-sm font-medium text-muted-foreground">{formula.label}</p>
          <p className="mt-2 overflow-x-auto font-mono text-sm whitespace-nowrap text-foreground sm:text-base">
            {formula.expression}
          </p>
          {formula.variables && formula.variables.length > 0 && (
            <dl className="mt-3 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
              {formula.variables.map((variable) => (
                <div key={variable.symbol} className="contents">
                  <dt className="font-mono font-medium">{variable.symbol}</dt>
                  <dd className="text-muted-foreground">{variable.meaning}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      ))}
    </div>
  );
}
