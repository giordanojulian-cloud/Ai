"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { track } from "@/lib/analytics";
import { postJson } from "@/lib/api-client";

export function SuggestCalculatorForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  if (status === "done") {
    return (
      <p role="status" className="text-sm font-medium">
        Thanks for the suggestion! We review every request when planning new calculators.
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setStatus("sending");
        setError("");
        const result = await postJson("/api/suggestions", {
          title: String(form.get("title") ?? ""),
          description: String(form.get("description") ?? "") || undefined,
          email: String(form.get("email") ?? "") || undefined,
          website: String(form.get("website") ?? ""),
        });
        if (!result.ok) {
          setError(result.error);
          setStatus("idle");
          return;
        }
        track("calculator_suggestion_submitted", {});
        setStatus("done");
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="suggest-title">Which calculator should we build?</Label>
        <Input id="suggest-title" name="title" required minLength={3} maxLength={120} placeholder="e.g. Car lease calculator" />
      </div>
      {!compact && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="suggest-description">
            What should it help you figure out? <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea id="suggest-description" name="description" maxLength={2000} />
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="suggest-email">
          Email <span className="font-normal text-muted-foreground">(optional, if you’d like to hear back)</span>
        </Label>
        <Input id="suggest-email" name="email" type="email" maxLength={254} autoComplete="email" />
      </div>
      {/* Honeypot: hidden from people, often filled in by bots. */}
      <div aria-hidden className="hidden">
        <label htmlFor="suggest-website">Website</label>
        <input id="suggest-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {error && (
        <p role="alert" className="text-sm text-negative">
          {error}
        </p>
      )}
      <Button type="submit" disabled={status === "sending"} className="self-start">
        {status === "sending" ? "Sending…" : "Send suggestion"}
      </Button>
    </form>
  );
}
