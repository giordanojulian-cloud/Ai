import { describe, expect, it } from "vitest";
import { defineCalculator } from "../types";
import { getDefaultValues, parseNumberInput, validateValues, valuesFromSearchParams, valuesToSearchParams } from "./values";

const definition = defineCalculator<{ amount: number; unit: string; mode: string; flag: boolean; hidden: number }>({
  slug: "test",
  fields: [
    {
      key: "amount",
      label: "Amount",
      type: "number",
      format: "percent",
      default: 20,
      min: 0,
      unit: { key: "unit", default: "percent", options: [{ value: "percent", label: "%", format: "percent", max: 100 }, { value: "amount", label: "$", format: "currency", max: 1000 }] },
    },
    { key: "mode", label: "Mode", type: "select", default: "a", options: [{ value: "a", label: "A" }, { value: "b", label: "B" }] },
    { key: "flag", label: "Flag", type: "toggle", default: false },
    { key: "hidden", label: "Hidden", type: "number", format: "integer", default: 1, min: 1, max: 5, visibleWhen: (v) => v.mode === "b" },
  ],
  compute: (v) => ({ primary: { label: "x", value: v.amount, format: "number" }, secondary: [] }),
});

describe("parseNumberInput", () => {
  it("accepts formatted input", () => {
    expect(parseNumberInput("$1,250.50")).toBe(1250.5);
    expect(parseNumberInput(" 6.5% ")).toBe(6.5);
    expect(parseNumberInput("-3")).toBe(-3);
    expect(parseNumberInput(".5")).toBe(0.5);
  });

  it("rejects garbage", () => {
    expect(parseNumberInput("")).toBeNull();
    expect(parseNumberInput("abc")).toBeNull();
    expect(parseNumberInput("1.2.3")).toBeNull();
    expect(parseNumberInput("Infinity")).toBeNull();
  });
});

describe("validateValues", () => {
  it("accepts defaults", () => {
    expect(validateValues(definition, getDefaultValues(definition)).ok).toBe(true);
  });

  it("applies unit-specific bounds", () => {
    expect(validateValues(definition, { ...getDefaultValues(definition), amount: 500 }).errors.amount).toMatch(/between/);
    expect(validateValues(definition, { ...getDefaultValues(definition), amount: 500, unit: "amount" }).ok).toBe(true);
  });

  it("enforces integers and skips hidden fields", () => {
    expect(validateValues(definition, { ...getDefaultValues(definition), hidden: 99 }).ok).toBe(true);
    expect(validateValues(definition, { ...getDefaultValues(definition), mode: "b", hidden: 2.5 }).errors.hidden).toMatch(/whole number/);
  });

  it("rejects unknown keys and wrong types", () => {
    expect(validateValues(definition, { ...getDefaultValues(definition), extra: 1 }).ok).toBe(false);
    expect(validateValues(definition, { ...getDefaultValues(definition), flag: "yes" }).ok).toBe(false);
    expect(validateValues(definition, null).ok).toBe(false);
  });
});

describe("share URLs", () => {
  it("round-trips values", () => {
    const values = { amount: 450, unit: "amount", mode: "b", flag: true, hidden: 3 };
    const { values: parsed, applied } = valuesFromSearchParams(definition, valuesToSearchParams(definition, values));
    expect(applied).toBe(true);
    expect(parsed).toEqual(values);
  });

  it("ignores malformed params and keeps defaults", () => {
    const { values, applied } = valuesFromSearchParams(definition, new URLSearchParams("amount=abc&mode=zzz&flag=maybe&unit=bogus"));
    expect(applied).toBe(false);
    expect(values).toEqual(getDefaultValues(definition));
  });
});
