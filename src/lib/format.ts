import { localeConfig } from "@/config/locale";

/**
 * How a number should be presented. Calculator outputs carry a format so the
 * UI, tables, charts, CSV export and share text all render values identically.
 */
export type ValueFormat =
  | "currency" // $1,234.56
  | "currencyWhole" // $1,235
  | "percent" // 6.5% (value is already in percent units, e.g. 6.5)
  | "number" // 1,234.57
  | "integer" // 1,235
  | "months" // 2 years, 3 months (value = months)
  | "years" // 12.5 years
  | "multiple" // 3.5×
  | "hours"; // 40 hrs

/**
 * Round half away from zero at `decimals` places without binary artifacts
 * (e.g. roundTo(1.005, 2) === 1.01, not 1). Never returns -0.
 */
export function roundTo(value: number, decimals = 2): number {
  if (!Number.isFinite(value)) return value;
  const factor = 10 ** decimals;
  const rounded = Math.round(Math.abs(value) * factor * (1 + Number.EPSILON)) / factor;
  const signed = value < 0 ? -rounded : rounded;
  return Object.is(signed, -0) ? 0 : signed;
}

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = JSON.stringify(options);
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(localeConfig.locale, options);
    formatterCache.set(key, formatter);
  }
  return formatter;
}

export function formatCurrency(value: number, decimals = 2): string {
  return getFormatter({
    style: "currency",
    currency: localeConfig.currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(roundTo(value, decimals));
}

export function formatNumber(value: number, maxDecimals = 2, minDecimals = 0): string {
  return getFormatter({
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  }).format(roundTo(value, maxDecimals));
}

/** `value` is in percent units: formatPercent(6.5) === "6.5%". */
export function formatPercent(value: number, maxDecimals = 2): string {
  return `${formatNumber(value, maxDecimals)}%`;
}

export function formatMonths(totalMonths: number): string {
  const months = Math.round(totalMonths);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (rest > 0 || years === 0) parts.push(`${rest} ${rest === 1 ? "month" : "months"}`);
  return parts.join(", ");
}

export function formatValue(value: number, format: ValueFormat): string {
  if (!Number.isFinite(value)) return "—";
  switch (format) {
    case "currency":
      return formatCurrency(value, 2);
    case "currencyWhole":
      return formatCurrency(value, 0);
    case "percent":
      return formatPercent(value, 2);
    case "number":
      return formatNumber(value, 2);
    case "integer":
      return formatNumber(value, 0);
    case "months":
      return formatMonths(value);
    case "years":
      return `${formatNumber(value, 1)} ${roundTo(value, 1) === 1 ? "year" : "years"}`;
    case "multiple":
      return `${formatNumber(value, 2)}×`;
    case "hours":
      return `${formatNumber(value, 2)} hrs`;
  }
}

/** Compact axis labels for charts: $1.2M, $450K. */
export function formatCompact(value: number, format: ValueFormat): string {
  const isMoney = format === "currency" || format === "currencyWhole";
  const compact = getFormatter({
    notation: "compact",
    maximumFractionDigits: 1,
    ...(isMoney ? { style: "currency", currency: localeConfig.currency } : {}),
  }).format(value);
  return format === "percent" ? `${compact}%` : compact;
}
