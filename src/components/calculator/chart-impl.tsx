"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartSpec } from "@/calculators/types";
import { formatCompact, formatValue } from "@/lib/format";

const color = (index: number) => `var(--chart-${((index - 1) % 5) + 1})`;

const axisProps = {
  stroke: "var(--subtle-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
} as const;

const tooltipStyle = {
  contentStyle: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 12,
    color: "var(--foreground)",
  },
  labelStyle: { color: "var(--muted-foreground)", marginBottom: 4 },
} as const;

export default function ChartImpl({ chart, height }: { chart: ChartSpec; height: number }) {
  const format = (value: unknown) => (typeof value === "number" ? formatValue(value, chart.valueFormat) : String(value));
  const labelFormatter = (label: unknown) => (chart.xLabel ? `${chart.xLabel} ${String(label)}` : String(label));

  // Text alternative for screen readers: the chart's data as a summary.
  const summary = `${chart.title}. ${chart.series.map((s) => s.label).join(", ")} across ${chart.data.length} points.`;

  if (chart.kind === "donut") {
    const valueKey = chart.series[0]?.key ?? "value";
    const total = chart.data.reduce((sum, d) => sum + Number(d[valueKey] ?? 0), 0);
    return (
      <div role="img" aria-label={summary} className="grid items-center gap-4 sm:grid-cols-[180px_1fr]">
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chart.data} dataKey={valueKey} nameKey={chart.xKey} innerRadius={55} outerRadius={85} paddingAngle={1} stroke="var(--surface)" isAnimationActive={false}>
                {chart.data.map((_, index) => (
                  <Cell key={index} fill={color(index + 1)} />
                ))}
              </Pie>
              <Tooltip formatter={format} {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex flex-col gap-2 text-sm">
          {chart.data.map((d, index) => (
            <li key={String(d[chart.xKey])} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="size-2.5 rounded-sm" style={{ background: color(index + 1) }} aria-hidden />
                {String(d[chart.xKey])}
              </span>
              <span className="tabular font-medium">
                {format(d[valueKey])}
                <span className="ml-2 text-xs text-subtle-foreground">
                  {total > 0 ? `${Math.round((Number(d[valueKey]) / total) * 100)}%` : ""}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const common = { data: chart.data, margin: { top: 8, right: 8, bottom: 0, left: 0 } };
  const axes = (
    <>
      <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
      <XAxis dataKey={chart.xKey} {...axisProps} minTickGap={16} />
      <YAxis {...axisProps} width={64} tickFormatter={(v: number) => formatCompact(v, chart.valueFormat)} />
      <Tooltip formatter={format} labelFormatter={labelFormatter} {...tooltipStyle} />
      {chart.series.length > 1 && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />}
    </>
  );

  let body: React.ReactElement;
  if (chart.kind === "bar" || chart.kind === "stacked-bar") {
    body = (
      <BarChart {...common}>
        {axes}
        {chart.series.map((s, i) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={color(s.color ?? i + 1)} stackId={chart.kind === "stacked-bar" ? "a" : undefined} radius={chart.kind === "bar" ? [3, 3, 0, 0] : 0} isAnimationActive={false} />
        ))}
      </BarChart>
    );
  } else if (chart.kind === "area" || chart.kind === "stacked-area") {
    body = (
      <AreaChart {...common}>
        {axes}
        {chart.series.map((s, i) => (
          <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={color(s.color ?? i + 1)} fill={color(s.color ?? i + 1)} fillOpacity={0.18} strokeWidth={2} stackId={chart.kind === "stacked-area" ? "a" : undefined} isAnimationActive={false} />
        ))}
      </AreaChart>
    );
  } else {
    body = (
      <LineChart {...common}>
        {axes}
        {chart.series.map((s, i) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={color(s.color ?? i + 1)} strokeWidth={2} dot={false} isAnimationActive={false} />
        ))}
      </LineChart>
    );
  }

  return (
    <div role="img" aria-label={summary} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {body}
      </ResponsiveContainer>
    </div>
  );
}
