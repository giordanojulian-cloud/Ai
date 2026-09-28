import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "The cap rate is the annual return a property would produce if you bought it with all cash: net operating income divided by value. It lets you compare properties of different sizes and prices on the same basis, without the effect of financing.",
    "In reverse, a market cap rate lets you estimate value. If similar buildings trade at a 6.5% cap rate, a property with $70,000 of NOI is worth roughly $70,000 ÷ 0.065 ≈ $1.08 million.",
  ],
  howItWorks: [
    "Gross income is reduced by the vacancy and credit-loss allowance to get effective gross income. Operating expenses are subtracted to get NOI. The cap rate is NOI divided by the property value; the value estimate is NOI divided by the cap rate.",
    "Mortgage payments, depreciation and income taxes are deliberately excluded from NOI — that's what makes cap rates comparable between buyers with different financing.",
  ],
  formulas: [
    { label: "Net operating income", expression: "NOI = Gross income × (1 − vacancy) − Operating expenses" },
    { label: "Cap rate", expression: "Cap rate = NOI ÷ Property value" },
    { label: "Value from a cap rate", expression: "Value = NOI ÷ Cap rate" },
  ],
  example: {
    title: "Example: $1,000,000 building",
    body: [
      {
        steps: [
          "Gross income of $120,000 less 5% vacancy leaves $114,000 of effective income.",
          "Subtracting $40,000 of operating expenses gives NOI of $74,000.",
          "Cap rate = $74,000 ÷ $1,000,000 = 7.4%.",
          "At a 6.5% market cap rate, the same NOI implies a value of about $1,138,462.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "What is a good cap rate?",
      body: [
        "There's no universal target. Cap rates reflect risk and growth expectations: stabilized properties in strong markets often trade at lower cap rates, while older properties or weaker markets trade higher. Compare against recent sales of similar properties in the same area, and against current interest rates — when borrowing costs exceed the cap rate, leverage reduces your return.",
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Including the mortgage payment in operating expenses. NOI is always before debt service.",
            "Using the seller's pro forma instead of actual income and expenses.",
            "Leaving out vacancy, management or reserves, which inflates NOI and the cap rate.",
            "Comparing cap rates across very different property types or markets.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "Income and expenses are stabilized annual figures.",
    "Vacancy is applied to gross income as a single percentage.",
    "Financing, depreciation, capital improvements and taxes are excluded, as is standard for cap rates.",
  ],
  faqs: [
    {
      question: "Is a higher cap rate better?",
      answer: "A higher cap rate means more income per dollar of price, which is better for yield — but it often reflects higher risk, lower expected growth or more management intensity. It's a trade-off, not a score.",
    },
    {
      question: "What's the difference between cap rate and cash-on-cash return?",
      answer: "Cap rate ignores financing and measures the property's income yield. Cash-on-cash return measures cash flow after mortgage payments relative to the cash you invested, so it changes with your down payment and interest rate.",
    },
    {
      question: "Why do cap rates change with interest rates?",
      answer: "Investors compare property yields with what they could earn elsewhere and with their borrowing costs. When interest rates rise, buyers typically require higher cap rates, which pushes prices down for the same NOI.",
    },
  ],
};

export default content;
