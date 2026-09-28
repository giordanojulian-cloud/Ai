"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";
import type { CalculatorValues } from "@/calculators/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { track } from "@/lib/analytics";

type Status = { kind: "idle" } | { kind: "naming" } | { kind: "saving" } | { kind: "saved" } | { kind: "error"; message: string };

/** Beta: saves the current inputs to the signed-in user's dashboard. */
export function SaveCalculation({ slug, calculatorName, values }: { slug: string; calculatorName: string; values: CalculatorValues }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [name, setName] = useState(calculatorName);

  const save = async () => {
    setStatus({ kind: "saving" });
    const response = await fetch("/api/saved-calculations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ calculatorSlug: slug, name: name.trim() || calculatorName, inputs: values }),
    }).catch(() => null);

    if (response?.status === 401) {
      window.location.href = `/signin?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      return;
    }
    if (!response?.ok) {
      const body = (await response?.json().catch(() => null)) as { error?: string } | null;
      setStatus({ kind: "error", message: body?.error ?? "Could not save right now. Please try again." });
      return;
    }
    track("calculator_saved", { slug });
    setStatus({ kind: "saved" });
  };

  if (status.kind === "naming" || status.kind === "saving" || status.kind === "error") {
    return (
      <form
        className="flex w-full flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <label htmlFor={`save-name-${slug}`} className="sr-only">
          Name this calculation
        </label>
        <Input id={`save-name-${slug}`} value={name} maxLength={120} onChange={(e) => setName(e.target.value)} className="h-8 max-w-60 text-sm" autoFocus />
        <Button type="submit" size="sm" disabled={status.kind === "saving"}>
          {status.kind === "saving" ? "Saving…" : "Save"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setStatus({ kind: "idle" })}>
          Cancel
        </Button>
        {status.kind === "error" && (
          <p role="alert" className="w-full text-xs text-negative">
            {status.message}
          </p>
        )}
      </form>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={() => setStatus({ kind: "naming" })} disabled={status.kind === "saved"}>
      <Bookmark aria-hidden />
      {status.kind === "saved" ? "Saved to dashboard" : "Save"}
      <span className="rounded bg-surface-muted px-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">Beta</span>
    </Button>
  );
}
