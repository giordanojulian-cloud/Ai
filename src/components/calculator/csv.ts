import type { TableView } from "@/calculators/types";
import { roundTo } from "@/lib/format";

function escape(cell: string): string {
  // Quote cells containing separators and neutralize spreadsheet formula injection.
  const safe = /^[=+\-@\t\r]/.test(cell) && !/^-?\d/.test(cell) ? `'${cell}` : cell;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

/** CSV with raw numbers rounded to cents — spreadsheets handle their own formatting. */
export function tableViewToCsv(view: TableView): string {
  const header = view.columns.map((c) => escape(c.label)).join(",");
  const rows = [...view.rows, ...(view.footer ? [view.footer] : [])].map((row) =>
    view.columns
      .map((c) => {
        const value = row[c.key];
        if (typeof value === "number") return String(roundTo(value, 2));
        return escape(value ?? "");
      })
      .join(","),
  );
  return [header, ...rows].join("\n");
}
