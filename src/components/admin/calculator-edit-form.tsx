"use client";

import { useActionState } from "react";
import { saveCalculatorOverrides, type AdminFormState } from "@/app/admin/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

export interface EditValues {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  category: string;
  related: string;
  faqs: string;
  featured: boolean;
  premium: boolean;
  published: boolean;
}

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function CalculatorEditForm({ values, categories, calculators }: { values: EditValues; categories: { slug: string; name: string }[]; calculators: string[] }) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(saveCalculatorOverrides, { status: "idle" });
  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="slug" value={values.slug} />
      {state.status !== "idle" && <Alert variant={state.status === "saved" ? "success" : "error"}>{state.message}</Alert>}
      <Field id="name" label="Name">
        <Input id="name" name="name" defaultValue={values.name} required />
      </Field>
      <Field id="shortDescription" label="Short description" hint="Shown on cards and search results.">
        <Textarea id="shortDescription" name="shortDescription" defaultValue={values.shortDescription} rows={2} />
      </Field>
      <Field id="description" label="Description" hint="Shown under the H1.">
        <Textarea id="description" name="description" defaultValue={values.description} rows={3} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="seoTitle" label="SEO title" hint="Up to ~60 characters.">
          <Input id="seoTitle" name="seoTitle" defaultValue={values.seoTitle} />
        </Field>
        <Field id="category" label="Primary category">
          <Select id="category" name="category" defaultValue={values.category}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field id="seoDescription" label="SEO description" hint="50–170 characters.">
        <Textarea id="seoDescription" name="seoDescription" defaultValue={values.seoDescription} rows={2} />
      </Field>
      <Field id="keywords" label="Keywords" hint="Comma-separated. Used by search and the related-calculator engine.">
        <Input id="keywords" name="keywords" defaultValue={values.keywords} />
      </Field>
      <Field id="related" label="Related calculators" hint={`Comma-separated slugs, in order. Available: ${calculators.join(", ")}`}>
        <Input id="related" name="related" defaultValue={values.related} />
      </Field>
      <Field id="faqs" label="FAQs" hint="Leave empty to use the FAQs in code. Format: question on the first line, answer below; separate FAQs with a blank line.">
        <Textarea id="faqs" name="faqs" defaultValue={values.faqs} rows={10} className="font-mono text-xs" />
      </Field>
      <fieldset className="flex flex-wrap gap-6">
        <legend className="sr-only">Flags</legend>
        {(["published", "featured", "premium"] as const).map((flag) => (
          <label key={flag} className="flex items-center gap-2 text-sm">
            <input type="checkbox" name={flag} defaultChecked={values[flag]} className="size-4 accent-[var(--primary)]" />
            {flag[0]!.toUpperCase() + flag.slice(1)}
          </label>
        ))}
      </fieldset>
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
