import type { FaqEntry } from "@/calculators/types";

/** Parses admin FAQ text: question on the first line, answer below, FAQs separated by blank lines. */
export function parseFaqText(text: string): FaqEntry[] {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [question = "", ...rest] = block.split("\n");
      return { question: question.replace(/^Q:\s*/i, "").trim(), answer: rest.join(" ").replace(/^A:\s*/i, "").trim() };
    })
    .filter((faq) => faq.question && faq.answer);
}
