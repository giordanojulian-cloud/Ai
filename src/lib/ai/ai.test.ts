import { describe, expect, it } from "vitest";
import { buildExplanationMessage, EXPLANATION_SYSTEM_PROMPT } from "./prompt";

describe("explanation prompt", () => {
  it("includes all inputs, outputs and assumptions", () => {
    const text = buildExplanationMessage({
      calculatorName: "Mortgage Calculator",
      inputs: [{ label: "Home price", value: "$400,000" }],
      outputs: [{ label: "Monthly payment", value: "$2,539.28" }],
      assumptions: ["Fixed rate"],
    });
    expect(text).toContain("Home price: $400,000");
    expect(text).toContain("Monthly payment: $2,539.28");
    expect(text).toContain("- Fixed rate");
  });

  it("forbids advice", () => {
    expect(EXPLANATION_SYSTEM_PROMPT).toMatch(/do not advise/i);
  });
});
