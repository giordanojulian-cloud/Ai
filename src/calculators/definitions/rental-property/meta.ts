import type { CalculatorMeta } from "../../types";

export default {
  slug: "rental-property",
  name: "Rental Property Calculator",
  shortName: "Rental Property",
  category: "real-estate",
  secondaryCategories: ["investing"],
  shortDescription: "Analyze a rental's cash flow, NOI, cap rate and cash-on-cash return with a full pro forma.",
  description:
    "Analyze a rental property's cash flow, net operating income, cap rate and cash-on-cash return, with vacancy, every operating expense and financing included.",
  seoTitle: "Rental Property Calculator — Cash Flow, Cap Rate & ROI",
  seoDescription:
    "Analyze a rental property investment: monthly cash flow, NOI, cap rate, cash-on-cash return, DSCR and a year-one pro forma including vacancy, management and maintenance.",
  keywords: ["rental property", "rental", "investment property", "cash flow", "noi", "landlord", "real estate investing", "cap rate", "cash on cash"],
  searchAliases: ["is this rental a good investment", "rental cash flow calculator", "buy and hold calculator"],
  related: ["cap-rate", "cash-on-cash-return", "mortgage", "roi"],
  icon: "building",
  featured: true,
  popularity: 5,
  addedAt: "2026-09-06",
  disclaimer: "financial",
  affiliate: "mortgage",
  schema: { applicationCategory: "FinanceApplication" },
} satisfies CalculatorMeta;
