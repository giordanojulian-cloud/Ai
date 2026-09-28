"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { track } from "@/lib/analytics";
import { postJson } from "@/lib/api-client";

type State = "idle" | "comment" | "sending" | "done" | "error";

export function CalculatorFeedback({ slug }: { slug: string }) {
  const [state, setState] = useState<State>("idle");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const send = async (helpful: boolean, text?: string) => {
    setState("sending");
    const result = await postJson("/api/feedback", { calculatorSlug: slug, helpful, comment: text || undefined });
    if (!result.ok) {
      setError(result.error);
      setState("error");
      return;
    }
    track("feedback_submitted", { slug, helpful });
    setState("done");
  };

  return (
    <div className="flex flex-col gap-3" aria-live="polite">
      {state === "done" ? (
        <p className="text-sm font-medium">Thanks — your feedback helps us improve this calculator.</p>
      ) : state === "comment" || (state === "sending" && comment) ? (
        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void send(false, comment.trim());
          }}
        >
          <label htmlFor="feedback-comment" className="text-sm font-medium">
            What could be better? <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <Textarea id="feedback-comment" value={comment} maxLength={1000} onChange={(e) => setComment(e.target.value)} placeholder="A missing input, a confusing result, a bug…" />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={state === "sending"}>
              Send feedback
            </Button>
            <Button size="sm" variant="ghost" onClick={() => void send(false)}>
              Skip
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium">Was this calculator helpful?</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => void send(true)} disabled={state === "sending"}>
              <ThumbsUp aria-hidden /> Yes
            </Button>
            <Button size="sm" variant="outline" onClick={() => setState("comment")} disabled={state === "sending"}>
              <ThumbsDown aria-hidden /> No
            </Button>
          </div>
        </div>
      )}
      {state === "error" && <p className="text-sm text-negative">{error}</p>}
    </div>
  );
}
