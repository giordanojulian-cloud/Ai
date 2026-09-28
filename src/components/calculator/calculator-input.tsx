"use client";

import { useId, useState } from "react";
import { resolveNumberField } from "@/calculators/engine/values";
import type { CalculatorValues, FieldDefinition, NumberField, SelectField, ToggleField } from "@/calculators/types";
import { controlClass, Select } from "@/components/ui/input";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface CalculatorInputProps {
  field: FieldDefinition;
  values: CalculatorValues;
  error?: string;
  /** Number fields report `null` when the text cannot be parsed. */
  onChange: (key: string, value: number | string | boolean | null, raw?: string) => void;
  onUnitChange?: (field: NumberField, unit: string) => void;
}

/** Renders any field type with a label, help text and an associated error message. */
export function CalculatorInput(props: CalculatorInputProps) {
  const { field } = props;
  switch (field.type) {
    case "number":
      return <NumberInput {...props} field={field} />;
    case "select":
      return <SelectInput {...props} field={field} />;
    case "toggle":
      return <ToggleInput {...props} field={field} />;
  }
}

function FieldShell({
  id,
  label,
  help,
  error,
  children,
  helpId,
  errorId,
  labelAddon,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  helpId: string;
  errorId: string;
  children: React.ReactNode;
  labelAddon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex min-h-6 items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {labelAddon}
      </div>
      {children}
      {error ? (
        <p id={errorId} className="text-xs font-medium text-negative">
          {error}
        </p>
      ) : help ? (
        <p id={helpId} className="text-xs text-muted-foreground">
          {help}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(error: string | undefined, help: string | undefined, errorId: string, helpId: string) {
  if (error) return errorId;
  if (help) return helpId;
  return undefined;
}

/** Display a number the way a person would type it (thousands separators, no trailing zeros). */
function displayNumber(value: number, format: string): string {
  if (!Number.isFinite(value)) return "";
  const decimals = format === "integer" ? 0 : format === "currency" ? 2 : 4;
  return formatNumber(value, decimals);
}

function NumberInput({ field, values, error, onChange, onUnitChange }: CalculatorInputProps & { field: NumberField }) {
  const id = useId();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const { format } = resolveNumberField(field, values);
  const value = values[field.key] as number;
  // While focused we show exactly what the user typed; otherwise a formatted value.
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? displayNumber(value, format);
  const isCurrency = format === "currency";
  const isPercent = format === "percent";

  const unitToggle = field.unit ? (
    <div role="group" aria-label={`${field.label} unit`} className="inline-flex rounded-md border border-border bg-surface-muted p-0.5">
      {field.unit.options.map((option) => {
        const active = values[field.unit!.key] === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => !active && onUnitChange?.(field, option.value)}
            className={cn(
              "h-5 min-w-7 rounded px-1.5 text-[11px] font-semibold transition-colors",
              active ? "bg-surface text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="sr-only">{option.value === "percent" ? "Percent" : "Dollar amount"}: </span>
            {option.label}
          </button>
        );
      })}
    </div>
  ) : null;

  return (
    <FieldShell id={id} label={field.label} help={field.help} error={error} helpId={helpId} errorId={errorId} labelAddon={unitToggle}>
      <div className="relative">
        {isCurrency && (
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
            $
          </span>
        )}
        <input
          id={id}
          name={field.key}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={shown}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(error, field.help, errorId, helpId)}
          onFocus={() => setDraft(displayNumber(value, format).replace(/,/g, ""))}
          onBlur={() => setDraft(null)}
          onChange={(event) => {
            const raw = event.target.value;
            setDraft(raw);
            const cleaned = raw.replace(/[,$%\s]/g, "");
            if (cleaned === "") {
              onChange(field.key, field.optional ? 0 : null, raw);
              return;
            }
            const parsed = /^-?(\d+\.?\d*|\.\d+)$/.test(cleaned) ? Number(cleaned) : null;
            onChange(field.key, parsed, raw);
          }}
          className={cn(
            controlClass,
            "tabular h-11",
            isCurrency && "pl-7",
            (isPercent || field.suffix) && "pr-14",
          )}
        />
        {(isPercent || field.suffix) && (
          <span aria-hidden className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
            {isPercent ? "%" : field.suffix}
          </span>
        )}
      </div>
    </FieldShell>
  );
}

function SelectInput({ field, values, error, onChange }: CalculatorInputProps & { field: SelectField }) {
  const id = useId();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const value = String(values[field.key]);

  if (field.display === "segmented") {
    return (
      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-sm font-medium text-foreground">{field.label}</legend>
        <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-lg border border-border bg-surface-muted p-1">
          {field.options.map((option) => {
            const active = option.value === value;
            return (
              <label
                key={option.value}
                className={cn(
                  "flex min-h-9 cursor-pointer items-center justify-center rounded-md px-2 text-center text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring",
                  active ? "bg-surface text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name={`${id}-${field.key}`}
                  value={option.value}
                  checked={active}
                  onChange={() => onChange(field.key, option.value)}
                />
                {option.label}
              </label>
            );
          })}
        </div>
        {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
      </fieldset>
    );
  }

  return (
    <FieldShell id={id} label={field.label} help={field.help} error={error} helpId={helpId} errorId={errorId}>
      <Select
        id={id}
        name={field.key}
        value={value}
        className="h-11"
        aria-describedby={describedBy(error, field.help, errorId, helpId)}
        onChange={(event) => onChange(field.key, event.target.value)}
      >
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FieldShell>
  );
}

function ToggleInput({ field, values, onChange }: CalculatorInputProps & { field: ToggleField }) {
  const id = useId();
  const checked = Boolean(values[field.key]);
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {field.label}
        </label>
        {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(field.key, !checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-primary" : "bg-border-strong",
        )}
      >
        <span
          className={cn(
            "inline-block size-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5.5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}
