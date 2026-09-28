import { formatCurrency, formatPercent } from "@/lib/format";
import { marginFromPriceCost, markupFromPriceCost, priceFromMargin, priceFromMarkup } from "../../shared/pricing";
import { defineCalculator } from "../../types";

type Values = { mode: string; cost: number; markup: number; price: number; margin: number };

export default defineCalculator<Values>({
  slug: "markup",
  fields: [
    {
      key: "mode",
      label: "I know the cost and",
      type: "select",
      display: "segmented",
      default: "markup",
      fullWidth: true,
      options: [
        { value: "markup", label: "Markup %" },
        { value: "margin", label: "Target margin %" },
        { value: "price", label: "Selling price" },
      ],
    },
    { key: "cost", label: "Cost", type: "number", format: "currency", default: 40, min: 0.01, max: 1_000_000_000, step: 1 },
    { key: "markup", label: "Markup", type: "number", format: "percent", default: 50, min: 0, max: 100_000, step: 1, visibleWhen: (v) => v.mode === "markup" },
    { key: "margin", label: "Target margin", type: "number", format: "percent", default: 40, min: 0, max: 99.99, step: 1, visibleWhen: (v) => v.mode === "margin" },
    { key: "price", label: "Selling price", type: "number", format: "currency", default: 60, min: 0.01, max: 1_000_000_000, step: 1, visibleWhen: (v) => v.mode === "price" },
  ],
  compute: (v) => {
    const price = v.mode === "markup" ? priceFromMarkup(v.cost, v.markup) : v.mode === "margin" ? priceFromMargin(v.cost, v.margin) : v.price;
    const profit = price - v.cost;
    const markup = markupFromPriceCost(price, v.cost);
    const margin = marginFromPriceCost(price, v.cost);
    const tone = profit >= 0 ? ("positive" as const) : ("negative" as const);
    return {
      primary:
        v.mode === "price"
          ? { label: "Markup", value: markup, format: "percent", tone, hint: `${formatPercent(margin)} margin` }
          : { label: "Selling price", value: price, format: "currency", hint: `${formatCurrency(profit)} profit per unit` },
      secondary: [
        { label: "Selling price", value: price, format: "currency" },
        { label: "Profit per unit", value: profit, format: "currency", tone },
        { label: "Markup", value: markup, format: "percent" },
        { label: "Gross margin", value: margin, format: "percent" },
      ],
      tables: [
        {
          id: "reference",
          title: "Markup and margin reference",
          description: `Prices for a ${formatCurrency(v.cost)} cost at common markups.`,
          views: [
            {
              id: "common",
              label: "Common markups",
              columns: [
                { key: "markup", label: "Markup", format: "percent" },
                { key: "margin", label: "Margin", format: "percent" },
                { key: "price", label: "Price", format: "currency" },
                { key: "profit", label: "Profit", format: "currency" },
              ],
              rows: [10, 20, 25, 30, 40, 50, 75, 100, 150, 200].map((m) => {
                const p = priceFromMarkup(v.cost, m);
                return { markup: m, margin: marginFromPriceCost(p, v.cost), price: p, profit: p - v.cost };
              }),
            },
          ],
        },
      ],
      insights: [
        `A ${formatPercent(markup)} markup on a ${formatCurrency(v.cost)} cost gives a ${formatCurrency(price)} price — a ${formatPercent(margin)} margin.`,
        "Markup is measured against cost; margin is measured against price. Margin is always the smaller percentage when profit is positive.",
      ],
      warnings: profit < 0 ? ["The price is below cost, so each sale loses money."] : [],
    };
  },
});
