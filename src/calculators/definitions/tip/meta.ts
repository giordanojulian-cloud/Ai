import type { CalculatorMeta } from "../../types";

export default {
  slug: "tip",
  name: "Tip Calculator",
  shortName: "Tip",
  category: "everyday",
  shortDescription: "Calculate the tip and split the bill, with optional rounding.",
  description: "Calculate a tip on the pre-tax bill, split the total between any number of people, and optionally round each share up to a whole dollar.",
  seoTitle: "Tip Calculator — Calculate Tip & Split the Bill",
  seoDescription: "Calculate a restaurant tip on the pre-tax bill, split the check evenly between people, and round up each share. Compare 15%, 18%, 20% and more.",
  keywords: ["tip", "tip calculator", "gratuity", "split bill", "restaurant", "how much to tip", "split check"],
  searchAliases: ["how much should i tip", "split the bill calculator", "20 percent tip"],
  related: ["percentage", "salary-to-hourly", "markup", "savings-goal"],
  icon: "utensils",
  popularity: 20,
  addedAt: "2026-09-12",
  disclaimer: "none",
  schema: { applicationCategory: "UtilitiesApplication" },
} satisfies CalculatorMeta;
