import { createAnthropicProvider } from "./anthropic";
import type { ExplanationProvider } from "./types";

export * from "./types";

/**
 * Returns the configured provider, or null when AI is disabled. The app never
 * requires an API key: without ANTHROPIC_API_KEY the "Explain my result"
 * button is simply not rendered.
 */
export function getExplanationProvider(): ExplanationProvider | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return createAnthropicProvider({ apiKey, model: process.env.AI_MODEL || undefined });
}
