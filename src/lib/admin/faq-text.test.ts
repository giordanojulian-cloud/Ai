import { describe, expect, it } from "vitest";
import { parseFaqText } from "./faq-text";

describe("parseFaqText", () => {
  it("parses blocks separated by blank lines", () => {
    expect(parseFaqText("Q: What?\nA: This.\n\nWhy?\nBecause\nit is.")).toEqual([
      { question: "What?", answer: "This." },
      { question: "Why?", answer: "Because it is." },
    ]);
  });

  it("drops incomplete entries", () => {
    expect(parseFaqText("Only a question\n\n")).toEqual([]);
  });
});
