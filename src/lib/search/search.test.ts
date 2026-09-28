import { describe, expect, it } from "vitest";
import { calculatorMetas } from "@/calculators/registry";
import { toSearchDoc } from "./docs";
import { editDistance, searchCalculators, tokenize } from "./index";

const docs = calculatorMetas.map(toSearchDoc);
const top = (query: string) => searchCalculators(docs, query, 5).map((hit) => hit.doc.slug);

describe("search", () => {
  it("finds calculators by name", () => {
    expect(top("mortgage")[0]).toBe("mortgage");
    expect(top("profit margin")[0]).toBe("profit-margin");
    expect(top("cap rate")[0]).toBe("cap-rate");
  });

  it("understands natural-language queries", () => {
    expect(top("how much house can I afford")[0]).toBe("mortgage-affordability");
    expect(top("investment return").slice(0, 2)).toEqual(expect.arrayContaining(["roi"]));
    expect(top("how long to pay off my credit card")[0]).toBe("credit-card-payoff");
  });

  it("tolerates typos", () => {
    expect(top("morgage")[0]).toBe("mortgage");
    expect(top("compund intrest")[0]).toBe("compound-interest");
    expect(top("brake even")[0]).toBe("break-even");
  });

  it("returns nothing for stopword-only or unrelated queries", () => {
    expect(top("how much")).toEqual([]);
    expect(top("zzzzqqq")).toEqual([]);
  });

  it("tokenizes and stems", () => {
    expect(tokenize("Calculators, Mortgages & ROI!")).toEqual(["calculator", "mortgage", "roi"]);
  });

  it("bounds edit distance", () => {
    expect(editDistance("kitten", "sitting", 3)).toBe(3);
    expect(editDistance("abc", "xyzxyz", 1)).toBe(2);
  });
});
