"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { track } from "@/lib/analytics";
import { postJson } from "@/lib/api-client";

export function NewsletterForm({ location, title = "Get new calculators and useful financial tools." }: { location: string; title?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">{title}</p>
      {status === "done" ? (
        <p role="status" className="text-sm text-muted-foreground">
          You’re on the list. We only email when there’s something genuinely useful.
        </p>
      ) : (
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={async (event) => {
            event.preventDefault();
            const email = String(new FormData(event.currentTarget).get("email") ?? "");
            setStatus("sending");
            setError("");
            const result = await postJson("/api/newsletter", { email, source: location });
            if (!result.ok) {
              setError(result.error);
              setStatus("idle");
              return;
            }
            track("newsletter_subscribed", { location });
            setStatus("done");
          }}
        >
          <label htmlFor={`newsletter-${location}`} className="sr-only">
            Email address
          </label>
          <Input id={`newsletter-${location}`} name="email" type="email" required placeholder="you@example.com" autoComplete="email" className="sm:max-w-64" />
          <Button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Subscribing…" : "Subscribe"}
          </Button>
        </form>
      )}
      {error && (
        <p role="alert" className="text-sm text-negative">
          {error}
        </p>
      )}
    </div>
  );
}
