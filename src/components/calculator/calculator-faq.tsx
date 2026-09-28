import type { FaqEntry } from "@/calculators/types";

/** FAQ list using native <details>, so it works without JavaScript. */
export function CalculatorFAQ({ faqs }: { faqs: FaqEntry[] }) {
  if (!faqs.length) return null;
  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-surface">
      {faqs.map((faq) => (
        <details key={faq.question} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
            <h3 className="text-base">{faq.question}</h3>
            <span aria-hidden className="mt-0.5 text-muted-foreground transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 leading-relaxed text-muted-foreground">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
