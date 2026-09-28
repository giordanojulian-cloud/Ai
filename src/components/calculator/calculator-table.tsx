"use client";

import { useId, useState } from "react";
import type { TableColumn, TableSpec } from "@/calculators/types";
import { track } from "@/lib/analytics";
import { formatValue } from "@/lib/format";
import { cn } from "@/lib/utils";
import { tableViewToCsv } from "./csv";

export function CalculatorTable({ table, slug }: { table: TableSpec; slug: string }) {
  const id = useId();
  const [viewId, setViewId] = useState(table.views[0]?.id);
  const [expanded, setExpanded] = useState(false);
  const view = table.views.find((v) => v.id === viewId) ?? table.views[0];
  if (!view) return null;

  const limit = view.initialRows && !expanded ? view.initialRows : view.rows.length;
  const rows = view.rows.slice(0, limit);
  const alignOf = (column: TableColumn) =>
    column.align === "left" || (!column.format && column.align !== "right") ? "text-left" : "text-right";

  const exportCsv = () => {
    const blob = new Blob([tableViewToCsv(view)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug}-${table.id}-${view.id}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    track("table_exported", { slug, table: `${table.id}:${view.id}` });
  };

  return (
    <section aria-labelledby={`${id}-title`} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 id={`${id}-title`} className="text-sm font-semibold">
            {table.title}
          </h3>
          {table.description && <p className="text-xs text-muted-foreground">{table.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {table.views.length > 1 && (
            <div role="tablist" aria-label={`${table.title} view`} className="inline-flex rounded-md border border-border bg-surface-muted p-0.5">
              {table.views.map((v) => (
                <button
                  key={v.id}
                  role="tab"
                  type="button"
                  id={`${id}-tab-${v.id}`}
                  aria-selected={v.id === view.id}
                  aria-controls={`${id}-panel`}
                  onClick={() => {
                    setViewId(v.id);
                    setExpanded(false);
                  }}
                  className={cn(
                    "h-7 rounded px-3 text-xs font-medium transition-colors",
                    v.id === view.id ? "bg-surface text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={exportCsv}
            className="h-8 rounded-md border border-border px-3 text-xs font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div
        id={`${id}-panel`}
        role={table.views.length > 1 ? "tabpanel" : undefined}
        aria-labelledby={table.views.length > 1 ? `${id}-tab-${view.id}` : undefined}
        tabIndex={0}
        className="max-h-[32rem] overflow-auto rounded-lg border border-border"
      >
        <table className="tabular w-full min-w-[32rem] border-collapse text-sm">
          <caption className="sr-only">
            {table.title} — {view.label}
          </caption>
          <thead className="sticky top-0 bg-surface-muted text-xs text-muted-foreground">
            <tr>
              {view.columns.map((c) => (
                <th key={c.key} scope="col" className={cn("px-3 py-2 font-medium whitespace-nowrap", alignOf(c))}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-border">
                {view.columns.map((c) => {
                  const value = row[c.key];
                  return (
                    <td key={c.key} className={cn("px-3 py-2 whitespace-nowrap", alignOf(c))}>
                      {typeof value === "number" && c.format ? formatValue(value, c.format) : String(value ?? "")}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          {view.footer && (
            <tfoot className="border-t-2 border-border-strong font-semibold">
              <tr>
                {view.columns.map((c) => {
                  const value = view.footer![c.key];
                  return (
                    <td key={c.key} className={cn("px-3 py-2 whitespace-nowrap", alignOf(c))}>
                      {typeof value === "number" && c.format ? formatValue(value, c.format) : String(value ?? "")}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {view.initialRows !== undefined && view.rows.length > view.initialRows && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="self-start text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {expanded ? "Show fewer rows" : `Show all ${view.rows.length} rows`}
        </button>
      )}
    </section>
  );
}
