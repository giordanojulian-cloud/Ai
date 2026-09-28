import { z } from "zod";
import { formatNumber } from "@/lib/format";
import type {
  CalculatorDefinition,
  CalculatorValues,
  FieldDefinition,
  FieldErrors,
  NumberField,
  NumberInputFormat,
} from "../types";

/* eslint-disable @typescript-eslint/no-explicit-any -- definitions are generic over their value shape */
type AnyDefinition = CalculatorDefinition<any>;

/** Resolves the active format/bounds of a number field (honoring a $/% unit toggle). */
export function resolveNumberField(field: NumberField, values: CalculatorValues) {
  if (field.unit) {
    const selected = values[field.unit.key];
    const option = field.unit.options.find((o) => o.value === selected) ?? field.unit.options[0];
    return {
      format: option.format,
      min: option.min ?? field.min,
      max: option.max ?? field.max,
      step: option.step ?? field.step,
    };
  }
  return { format: field.format, min: field.min, max: field.max, step: field.step };
}

export function getDefaultValues(definition: AnyDefinition): CalculatorValues {
  const values: CalculatorValues = {};
  for (const field of definition.fields) {
    values[field.key] = field.default;
    if (field.type === "number" && field.unit) values[field.unit.key] = field.unit.default;
  }
  return values;
}

/**
 * Parses user-typed numbers. Accepts "1,250", "$1,250.50", "6.5%", " 12 ".
 * Returns null for empty or unparseable input.
 */
export function parseNumberInput(raw: string): number | null {
  const cleaned = raw.replace(/[,$%\s_]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return null;
  if (!/^-?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

function describeBound(value: number, format: NumberInputFormat): string {
  if (format === "currency") return `$${formatNumber(value, 2)}`;
  if (format === "percent") return `${formatNumber(value, 4)}%`;
  return formatNumber(value, 4);
}

function validateNumber(field: NumberField, value: number, values: CalculatorValues): string | undefined {
  const { format, min, max } = resolveNumberField(field, values);
  if (!Number.isFinite(value)) return `Enter a valid number for ${field.label.toLowerCase()}.`;
  if (format === "integer" && !Number.isInteger(value)) return `${field.label} must be a whole number.`;
  if (min !== undefined && max !== undefined && (value < min || value > max)) {
    return `Enter a value between ${describeBound(min, format)} and ${describeBound(max, format)}.`;
  }
  if (min !== undefined && value < min) return `Enter a value of at least ${describeBound(min, format)}.`;
  if (max !== undefined && value > max) return `Enter a value no greater than ${describeBound(max, format)}.`;
  return undefined;
}

function fieldSchema(field: FieldDefinition): z.ZodType {
  switch (field.type) {
    case "number":
      return z.number();
    case "select":
      return z.enum(field.options.map((o) => o.value) as [string, ...string[]]);
    case "toggle":
      return z.boolean();
  }
}

/** Zod schema describing the *shape* of a definition's values (types and enums). */
export function buildValuesSchema(definition: AnyDefinition) {
  const shape: Record<string, z.ZodType> = {};
  for (const field of definition.fields) {
    shape[field.key] = fieldSchema(field);
    if (field.type === "number" && field.unit) {
      shape[field.unit.key] = z.enum(field.unit.options.map((o) => o.value) as [string, ...string[]]);
    }
  }
  return z.object(shape).strict();
}

export type ValidationResult =
  | { ok: true; values: CalculatorValues; errors: FieldErrors }
  | { ok: false; values: CalculatorValues; errors: FieldErrors };

/**
 * Full validation: shape (Zod), per-field bounds for visible fields, then the
 * definition's cross-field rules. Used on both client and server.
 */
export function validateValues(definition: AnyDefinition, input: unknown): ValidationResult {
  const parsed = buildValuesSchema(definition).safeParse(input);
  if (!parsed.success) {
    const errors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "_form");
      errors[key] ??= "Invalid value.";
    }
    return { ok: false, values: getDefaultValues(definition), errors };
  }

  const values = parsed.data as CalculatorValues;
  const errors: FieldErrors = {};
  for (const field of definition.fields) {
    if (field.visibleWhen && !field.visibleWhen(values)) continue;
    if (field.type === "number") {
      const message = validateNumber(field, values[field.key] as number, values);
      if (message) errors[field.key] = message;
    }
  }
  if (Object.keys(errors).length === 0 && definition.validate) {
    Object.assign(errors, definition.validate(values));
  }
  const hasErrors = Object.values(errors).some(Boolean);
  return hasErrors ? { ok: false, values, errors } : { ok: true, values, errors };
}

/* -------------------------------------------------------------------------- */
/* Shareable URLs                                                             */
/* -------------------------------------------------------------------------- */

function paramFor(field: FieldDefinition): string {
  return field.param ?? field.key;
}

/** Serialize values into short, human-readable query params. */
export function valuesToSearchParams(definition: AnyDefinition, values: CalculatorValues): URLSearchParams {
  const params = new URLSearchParams();
  for (const field of definition.fields) {
    const value = values[field.key];
    if (value === undefined) continue;
    if (field.type === "toggle") params.set(paramFor(field), value ? "1" : "0");
    else params.set(paramFor(field), String(value));
    if (field.type === "number" && field.unit) {
      const unitValue = values[field.unit.key];
      if (unitValue !== undefined) params.set(field.unit.param ?? field.unit.key, String(unitValue));
    }
  }
  return params;
}

/**
 * Read values from a query string, keeping defaults for anything missing or
 * malformed. Never throws: shared links must not break the page.
 */
export function valuesFromSearchParams(definition: AnyDefinition, params: URLSearchParams): {
  values: CalculatorValues;
  applied: boolean;
} {
  const values = getDefaultValues(definition);
  let applied = false;
  for (const field of definition.fields) {
    const raw = params.get(paramFor(field));
    if (field.type === "number" && field.unit) {
      const unitRaw = params.get(field.unit.param ?? field.unit.key);
      if (unitRaw && field.unit.options.some((o) => o.value === unitRaw)) {
        values[field.unit.key] = unitRaw;
        applied = true;
      }
    }
    if (raw === null) continue;
    if (field.type === "number") {
      const parsed = parseNumberInput(raw);
      if (parsed !== null) {
        values[field.key] = parsed;
        applied = true;
      }
    } else if (field.type === "select") {
      if (field.options.some((o) => o.value === raw)) {
        values[field.key] = raw;
        applied = true;
      }
    } else if (raw === "1" || raw === "0" || raw === "true" || raw === "false") {
      values[field.key] = raw === "1" || raw === "true";
      applied = true;
    }
  }
  return { values, applied };
}
