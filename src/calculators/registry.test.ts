/**
 * Contract tests that every calculator must satisfy. Adding calculator #1,000
 * automatically adds it to these checks.
 */
import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getDefaultValues, validateValues, valuesFromSearchParams, valuesToSearchParams } from "./engine/values";
import { isCategorySlug } from "./categories";
import { calculatorMetas, loadCalculatorContent, loadCalculatorDefinition, relatedCalculators } from "./registry";
import type { ResultValue } from "./types";

const slugs = calculatorMetas.map((m) => m.slug);

describe("calculator registry", () => {
  it("has unique slugs", () => {
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("registers every definitions folder", () => {
    const folders = readdirSync(path.join(__dirname, "definitions"), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();
    expect([...slugs].sort()).toEqual(folders);
  });

  it("has at least 20 calculators", () => {
    expect(calculatorMetas.length).toBeGreaterThanOrEqual(20);
  });
});

describe.each(calculatorMetas.map((m) => [m.slug, m] as const))("%s", (slug, meta) => {
  it("has valid metadata", () => {
    expect(isCategorySlug(meta.category)).toBe(true);
    meta.secondaryCategories?.forEach((c) => expect(isCategorySlug(c)).toBe(true));
    expect(meta.seoTitle.length).toBeLessThanOrEqual(65);
    expect(meta.seoDescription.length).toBeGreaterThanOrEqual(70);
    expect(meta.seoDescription.length).toBeLessThanOrEqual(170);
    expect(meta.keywords.length).toBeGreaterThanOrEqual(3);
    expect(meta.addedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("links only to existing calculators", () => {
    meta.related.forEach((r) => {
      expect(slugs).toContain(r);
      expect(r).not.toBe(slug);
    });
    expect(relatedCalculators(calculatorMetas, meta).length).toBeGreaterThanOrEqual(3);
  });

  it("has complete educational content", async () => {
    const content = await loadCalculatorContent(slug);
    expect(content).toBeDefined();
    expect(content!.whatItMeans.length).toBeGreaterThan(0);
    expect(content!.howItWorks.length).toBeGreaterThan(0);
    expect(content!.formulas.length).toBeGreaterThan(0);
    expect(content!.assumptions.length).toBeGreaterThan(0);
    expect(content!.faqs.length).toBeGreaterThanOrEqual(3);
    expect(content!.faqs.length).toBeLessThanOrEqual(6);
    expect(content!.guide.length).toBeGreaterThan(0);
  });

  it("computes finite results from its defaults", async () => {
    const definition = await loadCalculatorDefinition(slug);
    expect(definition?.slug).toBe(slug);
    const validation = validateValues(definition!, getDefaultValues(definition!));
    expect(validation.errors).toEqual({});
    const result = definition!.compute(validation.values);
    const values: ResultValue[] = [result.primary, ...result.secondary, ...(result.sections?.flatMap((s) => s.items) ?? [])];
    for (const value of values) {
      expect(Number.isNaN(value.value), `${value.label} is NaN`).toBe(false);
    }
    expect(Number.isFinite(result.primary.value)).toBe(true);
  });

  it("round-trips its values through a share URL", async () => {
    const definition = (await loadCalculatorDefinition(slug))!;
    const defaults = getDefaultValues(definition);
    const params = valuesToSearchParams(definition, defaults);
    const { values } = valuesFromSearchParams(definition, new URLSearchParams(params.toString()));
    expect(values).toEqual(defaults);
  });

  it("uses unique field keys and share params", async () => {
    const definition = (await loadCalculatorDefinition(slug))!;
    const keys = definition.fields.flatMap((f) => [f.key, ...(f.type === "number" && f.unit ? [f.unit.key] : [])]);
    const params = definition.fields.flatMap((f) => [f.param ?? f.key, ...(f.type === "number" && f.unit ? [f.unit.param ?? f.unit.key] : [])]);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(params).size).toBe(params.length);
  });
});
