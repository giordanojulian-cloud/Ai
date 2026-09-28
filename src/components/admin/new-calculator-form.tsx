"use client";

import { useActionState } from "react";
import { createCalculatorDraft, type AdminFormState } from "@/app/admin/actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

export function NewCalculatorForm({ categories }: { categories: { slug: string; name: string }[] }) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(createCalculatorDraft, { status: "idle" });
  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {state.status === "error" && <Alert variant="error">{state.message}</Alert>}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-name">Name</Label>
        <Input id="new-name" name="name" required placeholder="Car Loan Calculator" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-slug">Slug</Label>
        <Input id="new-slug" name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="car-loan" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-category">Category</Label>
        <Select id="new-category" name="category">
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-short">Short description</Label>
        <Textarea id="new-short" name="shortDescription" rows={2} />
      </div>
      <Button type="submit" disabled={pending} className="self-start">
        Create draft
      </Button>
    </form>
  );
}
