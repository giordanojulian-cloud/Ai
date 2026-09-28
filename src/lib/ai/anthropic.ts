import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { buildExplanationMessage, EXPLANATION_SYSTEM_PROMPT } from "./prompt";
import { explanationSchema, ExplanationRefusedError, type Explanation, type ExplanationProvider, type ExplanationRequest } from "./types";

export const DEFAULT_AI_MODEL = "claude-opus-5";

/**
 * Claude-backed explanations. Uses structured outputs so the response always
 * matches `explanationSchema`, low effort (short, bounded task), and
 * server-side refusal fallbacks so a classifier decline is retried on
 * Anthropic's recommended fallback model instead of failing the request.
 */
export function createAnthropicProvider(options: { apiKey: string; model?: string }): ExplanationProvider {
  const client = new Anthropic({ apiKey: options.apiKey, timeout: 60_000, maxRetries: 2 });
  const model = options.model ?? DEFAULT_AI_MODEL;

  return {
    name: "anthropic",
    async explain(request: ExplanationRequest): Promise<Explanation> {
      const response = await client.beta.messages.parse({
        model,
        max_tokens: 4_000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        system: [{ type: "text", text: EXPLANATION_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: buildExplanationMessage(request) }],
        output_config: { effort: "low", format: betaZodOutputFormat(explanationSchema) },
      });

      if (response.stop_reason === "refusal") throw new ExplanationRefusedError();
      if (!response.parsed_output) throw new Error(`Explanation could not be parsed (stop_reason: ${response.stop_reason}).`);
      return response.parsed_output;
    },
  };
}
