import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "The break-even point is the sales volume at which total revenue exactly covers total costs — no profit, no loss. Every unit sold beyond it adds its contribution margin to profit; every unit short of it leaves part of your fixed costs uncovered.",
    "Break-even revenue is the same point in dollars, which is often easier to compare with sales forecasts. The target-profit figures extend the idea: they show the volume needed to earn a specific profit.",
  ],
  howItWorks: [
    "Contribution margin is the price minus the variable cost of each unit — the amount each sale contributes toward fixed costs. Dividing fixed costs by the contribution margin gives the break-even point in units; multiplying by price converts it to revenue.",
    "Because you can't sell a fraction of a unit, the headline result rounds up to the next whole unit. Adding a target profit to fixed costs before dividing gives the units needed for that profit.",
  ],
  formulas: [
    { label: "Contribution margin", expression: "CM = Price − Variable cost per unit" },
    { label: "Break-even units", expression: "Units = Fixed costs ÷ CM" },
    { label: "Break-even revenue", expression: "Revenue = Fixed costs ÷ (CM ÷ Price)" },
    { label: "Units for a target profit", expression: "Units = (Fixed costs + Target profit) ÷ CM" },
  ],
  example: {
    title: "Example: $80 product with $30 variable cost",
    body: [
      {
        steps: [
          "Contribution margin = $80 − $30 = $50 per unit (a 62.5% ratio).",
          "With $50,000 of fixed costs, break-even = $50,000 ÷ $50 = 1,000 units, or $80,000 of sales.",
          "To earn $20,000 of profit: ($50,000 + $20,000) ÷ $50 = 1,400 units, or $112,000 of sales.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Who this calculator is for",
      body: ["Founders testing whether a business idea can work, product teams setting prices, and managers evaluating a new location, hire or marketing campaign."],
    },
    {
      heading: "Ways to lower your break-even point",
      body: [
        {
          list: [
            "Raise prices — often the most powerful lever, since the full increase flows to contribution margin.",
            "Reduce variable costs through supplier negotiation, packaging or fulfillment changes.",
            "Cut or defer fixed costs, especially before revenue is proven.",
          ],
        },
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Classifying costs incorrectly. Payment processing and shipping are usually variable; salaries are usually fixed.",
            "Using fixed costs for a different period than your sales target.",
            "Assuming a single price when you sell several products — use a weighted average contribution margin.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "Price and variable cost per unit are constant at every volume.",
    "Fixed costs stay fixed across the range of volumes considered.",
    "All units produced are sold.",
    "Taxes are not considered; the target profit is pre-tax.",
  ],
  faqs: [
    {
      question: "What is a contribution margin?",
      answer: "The amount each unit contributes toward fixed costs and profit after covering its own variable costs: price minus variable cost per unit.",
    },
    {
      question: "How do I calculate break-even for a service business?",
      answer: "Treat an hour, a project or a client as your unit. Use your price per unit and the variable costs tied to delivering it, such as contractor time or software per seat.",
    },
    {
      question: "What if my variable cost is higher than my price?",
      answer: "Then each sale loses money and there is no break-even point — selling more increases losses. You'll need to raise prices or reduce per-unit costs.",
    },
  ],
};

export default content;
