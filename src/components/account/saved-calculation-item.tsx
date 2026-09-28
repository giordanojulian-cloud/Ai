"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteSavedCalculation, duplicateSavedCalculation, renameSavedCalculation, type ActionResult } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface SavedItem {
  id: string;
  name: string;
  calculatorName: string;
  href: string;
  updatedAt: string;
}

export function SavedCalculationItem({ item }: { item: SavedItem }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const run = (action: () => Promise<ActionResult>, after?: () => void) =>
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        setError("");
        after?.();
      } else setError(result.error);
    });

  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        {editing ? (
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              run(() => renameSavedCalculation(item.id, name), () => setEditing(false));
            }}
          >
            <label htmlFor={`rename-${item.id}`} className="sr-only">
              Calculation name
            </label>
            <Input id={`rename-${item.id}`} value={name} maxLength={120} onChange={(e) => setName(e.target.value)} className="h-8" autoFocus />
            <Button type="submit" size="sm" disabled={pending}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </form>
        ) : (
          <Link href={item.href} className="font-medium hover:text-primary">
            {item.name}
          </Link>
        )}
        <p className="text-xs text-muted-foreground">
          {item.calculatorName} · Updated {item.updatedAt}
        </p>
        {error && <p className="text-xs text-negative">{error}</p>}
      </div>
      <div className="flex shrink-0 gap-1">
        <Button size="sm" variant="ghost" onClick={() => setEditing(true)} disabled={pending}>
          Rename
        </Button>
        <Button size="sm" variant="ghost" onClick={() => run(() => duplicateSavedCalculation(item.id))} disabled={pending}>
          Duplicate
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-negative"
          disabled={pending}
          onClick={() => {
            if (window.confirm(`Delete “${item.name}”?`)) run(() => deleteSavedCalculation(item.id));
          }}
        >
          Delete
        </Button>
      </div>
    </li>
  );
}
