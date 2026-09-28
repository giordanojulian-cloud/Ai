"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from "react";
import {
  getDefaultValues,
  validateValues,
  valuesFromSearchParams,
  valuesToSearchParams,
} from "@/calculators/engine/values";
import type { CalculatorDefinition, CalculatorResult as Result, CalculatorValues, FieldErrors, NumberField } from "@/calculators/types";
import { track } from "@/lib/analytics";
import { formatValue, roundTo } from "@/lib/format";
import { CalculatorChart } from "./calculator-chart";
import { CalculatorForm } from "./calculator-form";
import { CalculatorResult, ResultInsights } from "./calculator-result";
import { CalculatorTable } from "./calculator-table";
import { ExplainResult } from "./explain-result";
import { SaveCalculation } from "./save-calculation";
import { ShareResults } from "./share-results";

export interface BoundCalculatorProps {
  name: string;
  features: { save: boolean; ai: boolean };
  /** Server-rendered content placed under the result card (ads, affiliate CTAs). */
  afterResult?: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDefinition = CalculatorDefinition<any>;

function safeCompute(definition: AnyDefinition, values: CalculatorValues): Result | null {
  try {
    return definition.compute(values);
  } catch (error) {
    console.error(`[${definition.slug}] compute failed`, error);
    return null;
  }
}

/** Binds a definition to the generic engine. Used by the generated widget map. */
export function bindCalculator(definition: AnyDefinition): ComponentType<BoundCalculatorProps> {
  function BoundCalculator(props: BoundCalculatorProps) {
    return <CalculatorEngine definition={definition} {...props} />;
  }
  BoundCalculator.displayName = `Calculator(${definition.slug})`;
  return BoundCalculator;
}

export function CalculatorSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]" aria-busy="true" aria-label="Loading calculator">
      <div className="h-96 animate-pulse rounded-xl border border-border bg-surface" />
      <div className="h-96 animate-pulse rounded-xl border border-border bg-surface" />
    </div>
  );
}

export function CalculatorEngine({ definition, name, features, afterResult }: BoundCalculatorProps & { definition: AnyDefinition }) {
  const slug = definition.slug;
  const defaults = useMemo(() => getDefaultValues(definition), [definition]);
  const [values, setValues] = useState<CalculatorValues>(defaults);
  const [parseErrors, setParseErrors] = useState<FieldErrors>({});
  const interacted = useRef(false);
  const completedTracked = useRef(false);

  const validation = useMemo(() => validateValues(definition, values), [definition, values]);
  const hasParseErrors = Object.keys(parseErrors).length > 0;
  const errors: FieldErrors = { ...validation.errors, ...parseErrors };
  const computed = useMemo(
    () => (validation.ok && !hasParseErrors ? safeCompute(definition, validation.values) : null),
    [definition, validation, hasParseErrors],
  );

  // Keep showing the last valid result (dimmed) while the user fixes an input.
  const [lastValid, setLastValid] = useState<Result | null>(computed);
  if (computed && computed !== lastValid) setLastValid(computed);
  const result = computed ?? lastValid;
  const stale = !computed;

  // After hydration: mark the calculator interactive (used by E2E tests) and
  // apply shared-link values. The page is statically rendered with defaults,
  // so query params can only be read client-side.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { values: fromUrl, applied } = valuesFromSearchParams(definition, new URLSearchParams(window.location.search));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time post-hydration sync
    if (applied) setValues(fromUrl);
    setReady(true);
    track("calculator_view", { slug });
  }, [definition, slug]);

  // Mirror inputs into the URL after the user edits, so refresh/back keep state.
  useEffect(() => {
    if (!interacted.current || !computed) return;
    const timer = setTimeout(() => {
      const query = valuesToSearchParams(definition, values).toString();
      window.history.replaceState(window.history.state, "", `${window.location.pathname}?${query}`);
      if (!completedTracked.current) {
        completedTracked.current = true;
        track("calculator_completed", { slug });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [computed, definition, slug, values]);

  const markInteracted = () => {
    if (!interacted.current) {
      interacted.current = true;
      track("calculator_started", { slug });
    }
  };

  const onChange = useCallback((key: string, value: number | string | boolean | null) => {
    markInteracted();
    setParseErrors((current) => {
      if (value === null) return { ...current, [key]: "Enter a number." };
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    if (value !== null) setValues((current) => ({ ...current, [key]: value }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUnitChange = useCallback((field: NumberField, unit: string) => {
    markInteracted();
    setValues((current) => {
      const next = { ...current, [field.unit!.key]: unit };
      const base = field.unit?.baseKey ? Number(current[field.unit.baseKey]) : NaN;
      const value = Number(current[field.key]);
      if (Number.isFinite(base) && base > 0 && Number.isFinite(value)) {
        next[field.key] = unit === "percent" ? roundTo((value / base) * 100, 2) : roundTo((value / 100) * base, 0);
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onReset = () => {
    setValues(defaults);
    setParseErrors({});
    window.history.replaceState(window.history.state, "", window.location.pathname);
  };

  const buildShareUrl = () =>
    `${window.location.origin}${window.location.pathname}?${valuesToSearchParams(definition, values).toString()}`;

  // On small screens the result card sits below the form; show a compact bar while it's off-screen.
  const resultsRef = useRef<HTMLElement>(null);
  const [resultsVisible, setResultsVisible] = useState(true);
  useEffect(() => {
    const node = resultsRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setResultsVisible(Boolean(entry?.isIntersecting)), { rootMargin: "0px 0px -40% 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Screen readers hear the headline result after typing pauses, not on every keystroke.
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    if (!computed || !interacted.current) return;
    const timer = setTimeout(
      () => setAnnouncement(`${computed.primary.label}: ${formatValue(computed.primary.value, computed.primary.format)}`),
      900,
    );
    return () => clearTimeout(timer);
  }, [computed]);

  return (
    <div className="flex flex-col gap-8" data-calculator={slug} data-ready={ready || undefined}>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <section aria-label="Inputs" className="rounded-xl border border-border bg-surface p-5 sm:p-6">
          <Suspense>
            <CalculatorForm
              definition={definition}
              values={values}
              errors={errors}
              onChange={onChange}
              onUnitChange={onUnitChange}
              onReset={onReset}
            />
          </Suspense>
        </section>

        <div className="flex flex-col gap-4 lg:sticky lg:top-20">
          <section ref={resultsRef} id="results" aria-label="Results" className="scroll-mt-20 flex flex-col gap-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="sr-only">Results</h2>
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {announcement}
            </p>
            {result ? (
              <Suspense>
                <CalculatorResult result={result} stale={stale} />
              </Suspense>
            ) : (
              <p className="text-sm text-muted-foreground">Enter your details to see results.</p>
            )}
            {stale && <p className="text-sm text-muted-foreground">Fix the highlighted inputs to update your results.</p>}

            {result?.insights?.length ? (
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <h2 className="text-sm font-semibold">Your result in context</h2>
                <ResultInsights insights={result.insights} />
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <ShareResults slug={slug} title={name} buildUrl={buildShareUrl} />
              {features.save && <SaveCalculation slug={slug} calculatorName={name} values={values} />}
            </div>
            {features.ai && computed && <ExplainResult slug={slug} values={values} />}
          </section>
          {afterResult}
        </div>
      </div>

      {result && !resultsVisible && (
        <a
          href="#results"
          aria-hidden="true"
          tabIndex={-1}
          className="fixed inset-x-3 bottom-3 z-30 flex items-center justify-between rounded-xl border border-border bg-surface/95 px-4 py-3 shadow-lg backdrop-blur lg:hidden"
        >
          <span className="text-xs text-muted-foreground">{result.primary.label}</span>
          <span className="tabular text-lg font-semibold">{formatValue(result.primary.value, result.primary.format)}</span>
        </a>
      )}

      {result && (result.charts?.length || result.tables?.length) ? (
        // Separate Suspense boundary: below-the-fold output hydrates in its own task.
        <Suspense>
        <div className={stale ? "opacity-50" : undefined}>
          {result.charts && result.charts.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-2">
              {result.charts.map((chart) => (
                <div key={chart.id} className="rounded-xl border border-border bg-surface p-5 sm:p-6">
                  <CalculatorChart chart={chart} />
                </div>
              ))}
            </div>
          )}
          {result.tables?.map((table) => (
            <div key={table.id} className="mt-6 rounded-xl border border-border bg-surface p-5 sm:p-6">
              <CalculatorTable table={table} slug={slug} />
            </div>
          ))}
        </div>
        </Suspense>
      ) : null}
    </div>
  );
}
