"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import type { CalculatorValues } from "@/calculators/types";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

interface Explanation {
  summary: string;
  considerations: string[];
  questions: string[];
}

/**
 * "Explain my result". The server recomputes the result from the inputs and
 * asks the configured AI provider to explain it — never to recommend actions.
 */
export function ExplainResult({ slug, values }: { slug: string; values: CalculatorValues }) {
  const [state, setState] = useState<{ status: "idle" | "loading" | "done" | "error"; data?: Explanation; error?: string }>({
    status: "idle",
  });

  const explain = async () => {
    setState({ status: "loading" });
    track("ai_explain_requested", { slug });
    const response = await fetch("/api/ai/explain", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug, values }),
    }).catch(() => null);
    const body = (await response?.json().catch(() => null)) as (Explanation & { error?: string }) | null;
    if (!response?.ok || !body) {
      setState({ status: "error", error: body?.error ?? "The explanation service is unavailable right now." });
      return;
    }
    setState({ status: "done", data: body });
  };

  return (
    <div className="flex flex-col gap-3">
      <Button variant="secondary" size="sm" onClick={explain} disabled={state.status === "loading"} className="self-start">
        <Sparkles aria-hidden />
        {state.status === "loading" ? "Explaining…" : "Explain my result"}
      </Button>
      <div aria-live="polite">
        {state.status === "error" && <p className="text-sm text-negative">{state.error}</p>}
        {state.status === "done" && state.data && (
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-muted/50 p-4 text-sm leading-relaxed">
            <p>{state.data.summary}</p>
            {state.data.considerations.length > 0 && (
              <div>
                <h4 className="font-semibold">Things to consider</h4>
                <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                  {state.data.considerations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {state.data.questions.length > 0 && (
              <div>
                <h4 className="font-semibold">Questions to explore next</h4>
                <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                  {state.data.questions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-xs text-subtle-foreground">AI-generated explanation of the numbers above. Not financial advice.</p>
          </div>
        )}
      </div>
    </div>
  );
}
