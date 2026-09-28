"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ChartSpec } from "@/calculators/types";

export const CHART_HEIGHT = 280;

function ChartPlaceholder() {
  return <div className="rounded-lg bg-surface-muted/60" style={{ height: CHART_HEIGHT }} aria-hidden />;
}

// Recharts is large; it is fetched only when a chart approaches the viewport,
// keeping it off the critical path of the (above-the-fold) calculator.
const ChartImpl = dynamic(() => import("./chart-impl"), { ssr: false, loading: ChartPlaceholder });

export function CalculatorChart({ chart }: { chart: ChartSpec }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fallback for environments without IntersectionObserver
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className="flex flex-col gap-3">
      <figcaption>
        <h3 className="text-sm font-semibold">{chart.title}</h3>
        {chart.description && <p className="text-xs text-muted-foreground">{chart.description}</p>}
      </figcaption>
      <div ref={ref}>{visible ? <ChartImpl chart={chart} height={CHART_HEIGHT} /> : <ChartPlaceholder />}</div>
    </figure>
  );
}
