import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveNumberField, validateValues } from "@/calculators/engine/values";
import { calculatorMetas, findCalculator, loadCalculatorContent, loadCalculatorDefinition } from "@/calculators/registry";
import { ExplanationRefusedError, getExplanationProvider } from "@/lib/ai";
import { formatValue } from "@/lib/format";
import { clientIp, jsonError, parseJsonRequest } from "@/lib/http";
import { rateLimiters } from "@/lib/rate-limit";

const schema = z.object({
  slug: z.string().max(100),
  values: z.record(z.string(), z.union([z.number(), z.string(), z.boolean()])),
});

/**
 * Explains a result. The server recomputes it from the inputs — the model
 * never sees client-supplied "results", only numbers we calculated.
 */
export async function POST(request: Request) {
  const provider = getExplanationProvider();
  if (!provider) return jsonError(501, "AI explanations are not enabled.");

  const parsed = await parseJsonRequest(request, schema, { limiter: rateLimiters.ai, limiterKey: `ai:${clientIp(request)}` });
  if (!parsed.ok) return parsed.response;

  const meta = findCalculator(calculatorMetas, parsed.data.slug);
  const definition = await loadCalculatorDefinition(parsed.data.slug);
  const content = await loadCalculatorContent(parsed.data.slug);
  if (!meta || !definition || !content) return jsonError(404, "Unknown calculator.");

  const validation = validateValues(definition, parsed.data.values);
  if (!validation.ok) return jsonError(400, "These inputs aren't valid for this calculator.");
  const values = validation.values;
  const result = definition.compute(values);

  const inputs = definition.fields
    .filter((f) => !f.visibleWhen || f.visibleWhen(values))
    .map((field) => {
      const value = values[field.key];
      if (field.type === "number") {
        const { format } = resolveNumberField(field, values);
        const shown = format === "currency" ? formatValue(value as number, "currency") : format === "percent" ? formatValue(value as number, "percent") : formatValue(value as number, "number");
        return { label: field.label, value: `${shown}${field.suffix ? ` ${field.suffix}` : ""}` };
      }
      if (field.type === "select") return { label: field.label, value: field.options.find((o) => o.value === value)?.label ?? String(value) };
      return { label: field.label, value: value ? "Yes" : "No" };
    });
  const outputs = [result.primary, ...result.secondary].map((item) => ({ label: item.label, value: formatValue(item.value, item.format) }));

  try {
    const explanation = await provider.explain({ calculatorName: meta.name, inputs, outputs, assumptions: content.assumptions });
    return NextResponse.json(explanation);
  } catch (error) {
    if (error instanceof ExplanationRefusedError) return jsonError(422, "We couldn't generate an explanation for this result.");
    console.error("[ai:explain]", error);
    return jsonError(502, "The explanation service is unavailable right now.");
  }
}
