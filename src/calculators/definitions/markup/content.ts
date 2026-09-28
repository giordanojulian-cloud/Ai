import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "Markup is how much you add to cost, expressed as a percentage of cost. Margin is how much of the selling price is profit, expressed as a percentage of price. They describe the same profit from two different starting points.",
    "Retailers and wholesalers often think in markup, while finance teams and investors think in margin. Knowing both prevents costly pricing mistakes — a 40% markup is not a 40% margin.",
  ],
  howItWorks: [
    "With a markup, the price is cost × (1 + markup). With a target margin, the price is cost ÷ (1 − margin). If you already know the price, markup is profit ÷ cost and margin is profit ÷ price.",
  ],
  formulas: [
    { label: "Price from markup", expression: "Price = Cost × (1 + Markup)" },
    { label: "Price from margin", expression: "Price = Cost ÷ (1 − Margin)" },
    { label: "Markup and margin from price", expression: "Markup = (Price − Cost) ÷ Cost · Margin = (Price − Cost) ÷ Price" },
    { label: "Converting", expression: "Margin = Markup ÷ (1 + Markup) · Markup = Margin ÷ (1 − Margin)" },
  ],
  example: {
    title: "Example: $40 cost",
    body: [
      {
        steps: [
          "A 50% markup gives a price of $40 × 1.5 = $60 and $20 of profit.",
          "That $20 is 33.33% of the $60 price — the margin.",
          "To earn a 40% margin instead, the price must be $40 ÷ 0.6 ≈ $66.67, which is a 66.67% markup.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Who this calculator is for",
      body: ["Retailers, e-commerce sellers, wholesalers, restaurants and service businesses setting or checking prices."],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Applying a target margin as a markup, which underprices every product.",
            "Using only the product's purchase cost. Include freight, packaging and payment fees for a true landed cost.",
            "Forgetting discounts. If you routinely discount 10%, set list prices so the discounted price still hits your margin.",
          ],
        },
      ],
    },
  ],
  assumptions: ["Cost is the full per-unit cost you want the price to cover.", "Discounts, taxes and returns are not included."],
  faqs: [
    {
      question: "Is markup the same as margin?",
      answer: "No. Markup divides profit by cost; margin divides profit by price. For the same product, markup is always the larger number when profit is positive.",
    },
    {
      question: "What markup gives a 50% margin?",
      answer: "A 100% markup. Doubling the cost ($50 cost → $100 price) gives $50 profit, which is 50% of the price.",
    },
    {
      question: "What is keystone pricing?",
      answer: "A retail convention of doubling the wholesale cost — a 100% markup, or 50% margin.",
    },
  ],
};

export default content;
