import type { ValueFormat } from "@/lib/format";
import type { CategorySlug } from "./categories";

/* -------------------------------------------------------------------------- */
/* Metadata (registry, search, listings, SEO)                                 */
/* -------------------------------------------------------------------------- */

export type DisclaimerKind = "financial" | "estimate" | "none";

/** Keys into src/config/monetization.ts. */
export type AffiliateVertical = "mortgage" | "brokerage" | "savings" | "debt" | "business-software" | "payroll";
export type LeadVertical = "mortgage" | "real-estate-agent" | "contractor" | "financial-advisor";

export type CalculatorIcon =
  | "home"
  | "landmark"
  | "trending-up"
  | "piggy-bank"
  | "credit-card"
  | "wallet"
  | "percent"
  | "clock"
  | "building"
  | "key"
  | "receipt"
  | "briefcase"
  | "users"
  | "line-chart"
  | "scale"
  | "tag"
  | "hard-hat"
  | "ruler"
  | "calculator"
  | "utensils";

/**
 * Everything about a calculator except its math and long-form content.
 * Small by design: this is what listings, search and sitemaps load.
 */
export interface CalculatorMeta {
  slug: string;
  name: string;
  /** Used in dense UI such as cards and breadcrumbs. Defaults to `name`. */
  shortName?: string;
  category: CategorySlug;
  /** Additional categories this calculator should be listed under. */
  secondaryCategories?: CategorySlug[];
  /** One sentence, shown on cards and search results. */
  shortDescription: string;
  /** One or two sentences, shown under the H1. */
  description: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  /** Natural-language phrasings people search for ("how much house can i afford"). */
  searchAliases?: string[];
  /** Ordered, explicit related calculators. The discovery engine fills the rest. */
  related: string[];
  icon: CalculatorIcon;
  featured?: boolean;
  /** Lower = more popular. Drives "Popular calculators". */
  popularity?: number;
  premium?: boolean;
  status?: "published" | "draft";
  /** ISO date (YYYY-MM-DD). Drives "Recently added" and sitemap lastmod. */
  addedAt: string;
  updatedAt?: string;
  disclaimer: DisclaimerKind;
  affiliate?: AffiliateVertical;
  leadGen?: LeadVertical;
  /** Structured data to emit. FAQ schema is only emitted when FAQs exist. */
  schema?: { applicationCategory?: "FinanceApplication" | "BusinessApplication" | "UtilitiesApplication" };
}

/* -------------------------------------------------------------------------- */
/* Inputs                                                                     */
/* -------------------------------------------------------------------------- */

export type InputValue = number | string | boolean;
export type CalculatorValues = Record<string, InputValue>;

export type NumberInputFormat = "currency" | "percent" | "number" | "integer";

interface BaseField<K extends string> {
  key: K;
  label: string;
  /** Short helper text shown under the input and announced to screen readers. */
  help?: string;
  /** Group id from `CalculatorDefinition.groups`. */
  group?: string;
  /** Short query-string key for shareable URLs. Defaults to `key`. */
  param?: string;
  /** Hide the field unless this returns true. Hidden fields keep their value. */
  visibleWhen?: (values: CalculatorValues) => boolean;
  /** Layout hint: occupy the full row even on wide screens. */
  fullWidth?: boolean;
}

export interface UnitOption {
  value: string;
  label: string;
  format: NumberInputFormat;
  min?: number;
  max?: number;
  step?: number;
}

export interface NumberField<K extends string = string> extends BaseField<K> {
  type: "number";
  format: NumberInputFormat;
  default: number;
  min?: number;
  max?: number;
  step?: number;
  /** Trailing unit text such as "years" or "hrs/week". */
  suffix?: string;
  /** Allow the field to be left empty (treated as 0). */
  optional?: boolean;
  /**
   * A $ / % style toggle. The selected unit is stored under `unit.key` and
   * overrides this field's format and bounds. When `baseKey` is set, the value
   * is converted when the unit is switched (percent of base <-> amount).
   */
  unit?: {
    key: string;
    param?: string;
    default: string;
    options: [UnitOption, UnitOption];
    baseKey?: string;
  };
}

export interface SelectField<K extends string = string> extends BaseField<K> {
  type: "select";
  default: string;
  options: { value: string; label: string }[];
  /** Render as a segmented control instead of a dropdown (best for 2–4 options). */
  display?: "dropdown" | "segmented";
}

export interface ToggleField<K extends string = string> extends BaseField<K> {
  type: "toggle";
  default: boolean;
}

export type FieldDefinition<K extends string = string> = NumberField<K> | SelectField<K> | ToggleField<K>;

export interface FieldGroup {
  id: string;
  label: string;
  /** Collapsed by default (e.g. "Advanced" or "Taxes & insurance"). */
  collapsible?: boolean;
  description?: string;
}

/** Map of field key -> message. */
export type FieldErrors = Partial<Record<string, string>>;

/* -------------------------------------------------------------------------- */
/* Outputs                                                                    */
/* -------------------------------------------------------------------------- */

export type ResultTone = "default" | "positive" | "negative";

export interface ResultValue {
  label: string;
  value: number;
  format: ValueFormat;
  /** Short explanation shown beneath the value. */
  hint?: string;
  tone?: ResultTone;
}

export interface ResultSection {
  title: string;
  description?: string;
  items: ResultValue[];
}

export interface ChartSeries {
  key: string;
  label: string;
  /** 1–5, mapped to the chart color tokens. */
  color?: 1 | 2 | 3 | 4 | 5;
}

export interface ChartSpec {
  id: string;
  title: string;
  description?: string;
  kind: "area" | "stacked-area" | "line" | "bar" | "stacked-bar" | "donut";
  /** For donut charts `xKey` is the label key and the single series is the value. */
  xKey: string;
  xLabel?: string;
  series: ChartSeries[];
  data: Record<string, number | string>[];
  valueFormat: ValueFormat;
}

export interface TableColumn {
  key: string;
  label: string;
  format?: ValueFormat;
  /** Text columns are left-aligned; numeric columns right-aligned. */
  align?: "left" | "right";
}

export interface TableView {
  id: string;
  label: string;
  columns: TableColumn[];
  rows: Record<string, number | string>[];
  /** Rows to show before "Show all" (defaults to all rows). */
  initialRows?: number;
  /** Optional footer (e.g. totals). */
  footer?: Record<string, number | string>;
}

export interface TableSpec {
  id: string;
  title: string;
  description?: string;
  views: TableView[];
}

export interface CalculatorResult {
  primary: ResultValue;
  secondary: ResultValue[];
  /** Extra labeled groups (scenarios, investment summary...). */
  sections?: ResultSection[];
  charts?: ChartSpec[];
  tables?: TableSpec[];
  /** Plain-language sentences about *this* result ("What this result means"). */
  insights?: string[];
  /** Non-blocking cautions (e.g. "Payment does not cover interest"). */
  warnings?: string[];
}

/* -------------------------------------------------------------------------- */
/* Definition (client-safe: fields + compute)                                 */
/* -------------------------------------------------------------------------- */

export interface CalculatorDefinition<V extends CalculatorValues = CalculatorValues> {
  slug: string;
  groups?: FieldGroup[];
  fields: FieldDefinition<Extract<keyof V, string>>[];
  /** Cross-field validation that per-field bounds can't express. */
  validate?: (values: V) => FieldErrors;
  /** Pure function: validated inputs -> result. Must not throw for valid input. */
  compute: (values: V) => CalculatorResult;
}

/**
 * Identity helper that gives definitions full type inference.
 * `V` describes the validated values `compute` receives.
 */
export function defineCalculator<V extends CalculatorValues>(definition: CalculatorDefinition<V>): CalculatorDefinition<V> {
  return definition;
}

/* -------------------------------------------------------------------------- */
/* Content (server-only: long-form education)                                 */
/* -------------------------------------------------------------------------- */

/** A paragraph, or a bulleted/numbered list. Plain text only (no HTML). */
export type ContentBlock = string | { list: string[] } | { steps: string[] };

export interface FormulaSpec {
  /** Human-readable label, e.g. "Monthly principal & interest". */
  label: string;
  /** Plain-text expression, e.g. "M = P × r(1 + r)^n ÷ ((1 + r)^n − 1)". */
  expression: string;
  variables?: { symbol: string; meaning: string }[];
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface CalculatorContent {
  /** "What this result means" — general guidance; the result panel adds result-specific insights. */
  whatItMeans: ContentBlock[];
  /** "How this calculator works". */
  howItWorks: ContentBlock[];
  formulas: FormulaSpec[];
  example: { title: string; body: ContentBlock[] };
  /** Educational guide sections (who it's for, inputs that matter, common mistakes...). */
  guide: { heading: string; body: ContentBlock[] }[];
  /** Explicit modelling assumptions. Required for financial calculators. */
  assumptions: string[];
  faqs: FaqEntry[];
  /** Citations for rules or constants (e.g. FHA MIP tables). */
  sources?: { label: string; url: string }[];
}
