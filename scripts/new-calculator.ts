/**
 * Scaffolds a new calculator folder with every required file.
 *
 *   npm run calculators:new -- <slug> "<Name>" <category>
 *   npm run calculators:new -- car-loan "Car Loan Calculator" finance
 *
 * Then fill in the TODOs and run `npm test`.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { categories } from "../src/calculators/categories";

const [slug, name, category] = process.argv.slice(2);
const usage = 'Usage: npm run calculators:new -- <slug> "<Name>" <category>';

if (!slug || !name || !category) {
  console.error(usage);
  process.exit(1);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error(`Slug "${slug}" must be kebab-case (e.g. car-loan).`);
  process.exit(1);
}
if (!categories.some((c) => c.slug === category)) {
  console.error(`Unknown category "${category}". Choose one of: ${categories.map((c) => c.slug).join(", ")}`);
  process.exit(1);
}

const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "src/calculators/definitions", slug);
if (existsSync(dir)) {
  console.error(`src/calculators/definitions/${slug} already exists.`);
  process.exit(1);
}
const today = new Date().toISOString().slice(0, 10);
const fn = `calculate${slug.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase())}`;

const files: Record<string, string> = {
  "logic.ts": `/**
 * Pure math for the ${name}. No React, no formatting — just numbers in,
 * numbers out, so it can be unit tested against known reference values.
 */
export interface Input {
  // TODO: define inputs in their natural units (dollars, percent units like 6.5, years…)
  amount: number;
  ratePercent: number;
}

export interface Output {
  // TODO: define outputs
  result: number;
}

export function ${fn}({ amount, ratePercent }: Input): Output {
  // TODO: implement the documented formula. Cite the source in content.ts if it is a rule (tax, loan program…).
  return { result: amount * (ratePercent / 100) };
}
`,
  "definition.ts": `import { formatCurrency } from "@/lib/format";
import { defineCalculator } from "../../types";
import { ${fn} } from "./logic";

type Values = { amount: number; rate: number };

export default defineCalculator<Values>({
  slug: "${slug}",
  fields: [
    // TODO: one entry per input. \`param\` (optional) is the short share-URL key.
    { key: "amount", label: "Amount", type: "number", format: "currency", default: 10_000, min: 0, max: 100_000_000, step: 100 },
    { key: "rate", label: "Rate", type: "number", format: "percent", default: 5, min: 0, max: 100, step: 0.1 },
  ],
  compute: (v) => {
    const r = ${fn}({ amount: v.amount, ratePercent: v.rate });
    return {
      primary: { label: "Result", value: r.result, format: "currency" },
      secondary: [{ label: "Amount", value: v.amount, format: "currency" }],
      insights: [\`TODO: explain what \${formatCurrency(r.result)} means for this user.\`],
    };
  },
});
`,
  "meta.ts": `import type { CalculatorMeta } from "../../types";

export default {
  slug: "${slug}",
  name: "${name}",
  category: "${category}",
  // TODO: write specific, useful copy. See docs/ADDING_A_CALCULATOR.md for length guidelines.
  shortDescription: "TODO: one sentence for cards and search results.",
  description: "TODO: one or two sentences shown under the page title.",
  seoTitle: "${name}",
  seoDescription: "TODO: 70-170 characters describing exactly what this calculator computes and for whom.",
  keywords: ["TODO"],
  searchAliases: [],
  related: [],
  icon: "calculator",
  addedAt: "${today}",
  disclaimer: "financial",
  status: "draft", // Flip to "published" (or remove) when the content is complete.
} satisfies CalculatorMeta;
`,
  "content.ts": `import type { CalculatorContent } from "../../types";

// TODO: write original, specific content. Every example number must be verified by a test.
const content: CalculatorContent = {
  whatItMeans: ["TODO"],
  howItWorks: ["TODO"],
  formulas: [{ label: "TODO", expression: "TODO" }],
  example: { title: "Example: TODO", body: [{ steps: ["TODO"] }] },
  guide: [
    { heading: "Who this calculator is for", body: ["TODO"] },
    { heading: "Common mistakes to avoid", body: [{ list: ["TODO"] }] },
  ],
  assumptions: ["TODO"],
  faqs: [
    { question: "TODO?", answer: "TODO" },
    { question: "TODO?", answer: "TODO" },
    { question: "TODO?", answer: "TODO" },
  ],
};

export default content;
`,
  [`${slug}.test.ts`]: `import { describe, expect, it } from "vitest";
import { ${fn} } from "./logic";

describe("${fn}", () => {
  it("matches a known reference value", () => {
    // TODO: replace with a value from an independent source (spreadsheet, official table, textbook).
    expect(${fn}({ amount: 10_000, ratePercent: 5 }).result).toBe(500);
  });
});
`,
};

mkdirSync(dir, { recursive: true });
for (const [file, text] of Object.entries(files)) writeFileSync(path.join(dir, file), text);
execFileSync("npx", ["tsx", path.join(root, "scripts/generate-calculator-index.ts")], { stdio: "inherit", cwd: root });
console.log(`\nCreated src/calculators/definitions/${slug}/. Next: fill in the TODOs, then run \`npm run check\`.`);
