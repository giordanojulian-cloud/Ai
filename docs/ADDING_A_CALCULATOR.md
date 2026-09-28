# Adding a calculator

This is the complete workflow for calculator #25, #100 or #1,000. A typical calculator takes one folder, five files and no UI code.

```bash
npm run calculators:new -- car-loan "Car Loan Calculator" finance
# edit src/calculators/definitions/car-loan/*
npm run check          # registry + lint + typecheck + tests
npm run dev            # http://localhost:3000/calculator/car-loan
```

The scaffold creates a `draft` calculator with TODOs. The registry contract tests (`src/calculators/registry.test.ts`) fail until the metadata and content are complete, so an unfinished calculator cannot be merged by accident.

---

## 1. Files

```
src/calculators/definitions/car-loan/
  meta.ts           registry metadata (listing, search, SEO, related links)
  logic.ts          pure math — no React, no formatting
  definition.ts     inputs + compute() → structured result
  content.ts        educational content (server only)
  car-loan.test.ts  reference-value tests
```

After adding or deleting a folder, run `npm run calculators:generate` (the scaffold does this for you). CI runs `npm run calculators:check`, which fails if the generated files are stale.

## 2. `logic.ts` — the math

Write plain functions that take numbers in natural units and return numbers. Reuse shared primitives instead of re-deriving formulas:

| Need | Use |
| --- | --- |
| Loan payment, amortization, payoff months, remaining balance | `@/lib/finance` (`loanPayment`, `amortizationSchedule`, `monthsToPayoff`…) |
| Rate conversions (APR ↔ APY, effective monthly rates) | `@/lib/finance` (`effectiveAnnualRate`, `equivalentMonthlyRate`…) |
| Mortgage-style schedules with taxes, insurance and mortgage insurance | `calculators/shared/housing.ts` |
| Balance growth with contributions | `calculators/shared/growth.ts` |
| NOI, cap rate, cash-on-cash, DSCR | `calculators/shared/property.ts` |
| Margin ↔ markup | `calculators/shared/pricing.ts` |

Rules:

- **Use explicit, documented formulas.** Never invent an equation because it sounds reasonable. If a rule has a source (tax table, loan program), put its parameters in a dated config file next to the logic — see `fha-mortgage/fha-rules.ts` and `employee-cost/payroll-rules.ts` — and cite it in `content.sources`.
- Rates are **percent units** at the boundary (`6.5` means 6.5%). Convert to decimals inside.
- Handle zero and edge cases explicitly (0% interest, zero denominators, payments that never cover interest). Return `Infinity`/`null` or a flag rather than `NaN`.
- Don't round inside the math. Formatting rounds for display (`roundTo`, `formatValue`).

## 3. `definition.ts` — inputs and outputs

```ts
import { defineCalculator } from "../../types";
import { calculateCarLoan } from "./logic";

type Values = { price: number; down: number; downUnit: string; rate: number; term: string; tradeIn: boolean };

export default defineCalculator<Values>({
  slug: "car-loan",
  groups: [
    { id: "loan", label: "Loan" },
    { id: "extras", label: "Trade-in & fees", collapsible: true },
  ],
  fields: [ /* see field types below */ ],
  validate: (v) => (v.down >= v.price ? { down: "Down payment must be less than the price." } : {}),
  compute: (v) => ({ primary: { … }, secondary: [ … ], charts: [ … ], tables: [ … ], insights: [ … ] }),
});
```

### Field types

| Type | Example | Notes |
| --- | --- | --- |
| `number` | `{ key: "rate", label: "Interest rate", type: "number", format: "percent", default: 6.5, min: 0, max: 25, step: 0.125 }` | `format`: `currency`, `percent`, `number`, `integer`. `suffix: "years"`. `optional: true` treats empty as 0. |
| `number` with $/% toggle | `unit: { key: "downUnit", default: "percent", baseKey: "price", options: [{ value: "percent", label: "%", format: "percent", max: 100 }, { value: "amount", label: "$", format: "currency" }] }` | Bounds per unit. `baseKey` converts the value when toggled. Use `amountFromUnit()` in `compute`. |
| `select` | `{ key: "term", type: "select", default: "60", options: [{ value: "60", label: "60 months" }] }` | `display: "segmented"` for 2–4 options. |
| `toggle` | `{ key: "round", type: "toggle", default: false, label: "Round up" }` | |

Common options: `group`, `help` (announced to screen readers), `param` (short share-URL key, e.g. `price`), `visibleWhen: (v) => v.mode === "payment"` (hidden fields are not validated), `fullWidth`.

Validation happens automatically: types via Zod, bounds and integers per field, then your `validate()` for cross-field rules. The same validation runs on the server for saved calculations and AI explanations.

### Result structure

| Key | Renders as |
| --- | --- |
| `primary` | The large headline number (`{ label, value, format, hint?, tone? }`) |
| `secondary` | Grid of supporting metrics |
| `sections` | Labeled metric groups (scenarios, investment summary) |
| `charts` | `kind`: `line`, `area`, `stacked-area`, `bar`, `stacked-bar`, `donut`. Lazy-loaded. |
| `tables` | One or more `views` (e.g. Annual / Monthly / Full term), `initialRows` for long tables, optional `footer`; CSV export is automatic |
| `insights` | "Your result in context" — sentences about *this* result |
| `warnings` | Non-blocking cautions |

Value formats: `currency`, `currencyWhole`, `percent` (value already in percent units), `number`, `integer`, `months` ("2 years, 3 months"), `years`, `multiple` ("3.5×"), `hours`.

Shared builders exist for common outputs: `amortizationTable()` and `balanceChart()` in `shared/housing.ts`, `growthChart()` and `growthTable()` in `shared/growth.ts`.

## 4. `meta.ts` — listing, search and SEO

```ts
export default {
  slug: "car-loan",
  name: "Car Loan Calculator",
  shortName: "Car Loan",                    // cards, footer
  category: "finance",
  secondaryCategories: ["debt"],            // also listed there
  shortDescription: "…",                    // one sentence, cards and search
  description: "…",                         // 1–2 sentences under the H1
  seoTitle: "Car Loan Calculator — Monthly Payment & Total Interest", // ≤ 65 chars
  seoDescription: "…",                      // 70–170 chars, specific
  keywords: ["car loan", "auto loan", "car payment"],
  searchAliases: ["how much car can i afford"], // natural-language queries
  related: ["debt-payoff", "credit-card-payoff", "savings-goal"], // explicit internal links, in order
  icon: "wallet",
  popularity: 21,                           // lower = more prominent
  addedAt: "2026-10-01",
  disclaimer: "financial",                  // financial | estimate | none
  affiliate: "debt",                        // optional monetization vertical
  schema: { applicationCategory: "FinanceApplication" },
} satisfies CalculatorMeta;
```

Remove `status: "draft"` (or set `"published"`) when ready. The sitemap, category pages, homepage sections, search index and related-calculator engine pick the calculator up automatically.

**Related calculators:** list 3–4 explicit links in order of usefulness; the discovery engine fills remaining slots by reverse links, category and shared keywords. Also add your new slug to the `related` list of 1–2 existing calculators so the cluster links both ways.

## 5. `content.ts` — education

Every calculator page renders the same sections from this structured content (plain text only — no HTML):

- `whatItMeans` — how to read the result in general (the result card adds result-specific insights).
- `howItWorks` — the method in words.
- `formulas` — each with `expression` and `variables`.
- `example` — a fully worked example.
- `guide` — sections such as *Who this calculator is for*, *Which inputs matter most*, *Common mistakes to avoid*.
- `assumptions` — every modeling simplification. Required.
- `faqs` — 3–6 genuinely useful questions (rendered with FAQPage schema).
- `sources` — citations for any rule-based parameters.

Content quality bar:

- Original and specific to this calculator; no generic filler or keyword stuffing.
- **Every number in the worked example must be computed, not estimated,** and asserted in the test file. (Our own review caught several hand-calculated examples that were off.)
- Explain, don't advise. Describe trade-offs; never tell the reader what to do.

## 6. Tests

At minimum:

1. Known reference values from an independent source (spreadsheet `PMT()`, official tables, textbook examples).
2. The worked example from `content.ts`, number for number.
3. Edge cases: zero rate, zero amounts, impossible inputs, boundary values (e.g. PMI exactly at 20% down).
4. Validation of cross-field rules.

The registry contract tests automatically verify, for every calculator: valid metadata and SEO lengths, existing related links, complete content with 3–6 FAQs, finite results from defaults, share-URL round-trips and unique field keys/params.

## 7. Checklist

- [ ] Formula documented and sourced; assumptions listed
- [ ] Worked example verified by a test
- [ ] Defaults produce a realistic, finite result
- [ ] `npm run check` passes
- [ ] Page reviewed on mobile and in dark mode
- [ ] Related links added in both directions

## Programmatic variants (future)

Location or segment variants (e.g. "Mortgage Calculator Texas") should reuse the same `definition.ts` with different defaults and genuinely localized content (tax rates, rules, examples). Add them only when each page has substantive unique content — the architecture supports it through a variant layer over `meta`/`content`, but thin duplicate pages are deliberately not generated.
