import { z } from "zod";

export const explanationSchema = z.object({
  summary: z.string().describe("Two to four plain-English sentences explaining what the result means."),
  considerations: z.array(z.string()).describe("Factors or assumptions that could change this result."),
  questions: z.array(z.string()).describe("Neutral questions the user could explore next."),
});

export type Explanation = z.infer<typeof explanationSchema>;

export interface ExplanationRequest {
  calculatorName: string;
  /** Human-readable inputs, e.g. [{ label: "Home price", value: "$400,000" }]. */
  inputs: { label: string; value: string }[];
  outputs: { label: string; value: string }[];
  assumptions: string[];
}

/** Implement this to plug in any model provider. */
export interface ExplanationProvider {
  readonly name: string;
  explain(request: ExplanationRequest): Promise<Explanation>;
}

export class ExplanationRefusedError extends Error {
  constructor() {
    super("The model declined to explain this result.");
    this.name = "ExplanationRefusedError";
  }
}
