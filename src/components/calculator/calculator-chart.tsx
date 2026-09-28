"use client";

import dynamic from "next/dynamic";
import type { ChartSpec } from "@/calculators/types";

export const CHART_HEIGHT = 280;

function ChartPlaceholder() {
  return <div className="animate-pulse rounded-lg bg-surface-muted" style={{ height: CHART_HEIGHT }} aria-hidden />;
}

// Recharts is ~100KB; load it only in the browser, after the calculator is interactive.
const ChartImpl = dynamic(() => import("./chart-impl"), { ssr: false, loading: ChartPlaceholder });

export function CalculatorChart({ chart }: { chart: ChartSpec }) {
  return (
    <figure className="flex flex-col gap-3">
      <figcaption>
        <h3 className="text-sm font-semibold">{chart.title}</h3>
        {chart.description && <p className="text-xs text-muted-foreground">{chart.description}</p>}
      </figcaption>
      <ChartImpl chart={chart} height={CHART_HEIGHT} />
    </figure>
  );
}
