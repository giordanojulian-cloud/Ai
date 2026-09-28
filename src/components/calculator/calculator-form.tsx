"use client";

import type { CalculatorDefinition, CalculatorValues, FieldDefinition, FieldErrors, NumberField } from "@/calculators/types";
import { cn } from "@/lib/utils";
import { CalculatorInput } from "./calculator-input";

interface CalculatorFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  definition: CalculatorDefinition<any>;
  values: CalculatorValues;
  errors: FieldErrors;
  onChange: (key: string, value: number | string | boolean | null, raw?: string) => void;
  onUnitChange: (field: NumberField, unit: string) => void;
  onReset: () => void;
}

/** Lays out fields by group. Collapsible groups use native <details> for zero-JS accessibility. */
export function CalculatorForm({ definition, values, errors, onChange, onUnitChange, onReset }: CalculatorFormProps) {
  const visible = (field: FieldDefinition) => !field.visibleWhen || field.visibleWhen(values);
  const groups = definition.groups?.length ? definition.groups : [{ id: "_default", label: "" }];

  const renderFields = (fields: FieldDefinition[]) => (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.key} className={cn((field.fullWidth || field.type === "toggle") && "sm:col-span-2")}>
          <CalculatorInput field={field} values={values} error={errors[field.key]} onChange={onChange} onUnitChange={onUnitChange} />
        </div>
      ))}
    </div>
  );

  return (
    <form
      noValidate
      aria-label="Calculator inputs"
      onSubmit={(event) => event.preventDefault()}
      className="flex flex-col gap-6"
    >
      {groups.map((group) => {
        const fields = definition.fields.filter(
          (field) => (field.group ?? groups[0]!.id) === group.id || (group.id === "_default" && !field.group),
        );
        const shown = fields.filter(visible);
        if (shown.length === 0) return null;
        if ("collapsible" in group && group.collapsible) {
          const hasError = shown.some((field) => errors[field.key]);
          return (
            <details key={group.id} className="group rounded-lg border border-border" open={hasError || undefined}>
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
                {group.label}
                <span aria-hidden className="text-muted-foreground transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>
              <div className="border-t border-border px-4 py-4">{renderFields(shown)}</div>
            </details>
          );
        }
        return (
          <fieldset key={group.id} className="flex flex-col gap-4">
            {group.label && (
              <legend className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{group.label}</legend>
            )}
            {renderFields(shown)}
          </fieldset>
        );
      })}
      <div>
        <button type="button" onClick={onReset} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          Reset to defaults
        </button>
      </div>
    </form>
  );
}
