import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "Profit margin is the share of each sales dollar you keep. Gross margin measures what's left after the direct cost of the product or service; operating margin also subtracts the costs of running the business; net margin subtracts taxes as well.",
    "Each level answers a different question. Gross margin shows whether your pricing covers production costs with room to spare. Operating margin shows whether the business model works. Net margin is what owners ultimately earn.",
  ],
  howItWorks: [
    "Gross profit is revenue minus cost of goods sold (COGS). Operating profit subtracts operating expenses from gross profit. Taxes are estimated by applying your tax rate to operating profit when it's positive, and net profit is what remains. Each profit figure divided by revenue gives its margin.",
    "The calculator also shows markup — gross profit divided by cost — because margin and markup describe the same price in different ways.",
  ],
  formulas: [
    { label: "Gross margin", expression: "Gross margin = (Revenue − COGS) ÷ Revenue" },
    { label: "Operating margin", expression: "Operating margin = (Gross profit − Operating expenses) ÷ Revenue" },
    { label: "Net margin", expression: "Net margin = (Operating profit − Taxes) ÷ Revenue" },
    { label: "Markup", expression: "Markup = (Revenue − COGS) ÷ COGS" },
  ],
  example: {
    title: "Example: $100,000 in sales",
    body: [
      {
        steps: [
          "Revenue $100,000 − COGS $60,000 = $40,000 gross profit, a 40% gross margin (a 66.67% markup on cost).",
          "Subtracting $25,000 of operating expenses leaves $15,000 operating profit — a 15% operating margin.",
          "At a 21% tax rate, taxes are $3,150 and net profit is $11,850, an 11.85% net margin.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Who this calculator is for",
      body: ["Business owners reviewing a profit and loss statement, e-commerce sellers checking product-level margins, and freelancers setting rates that cover overhead."],
    },
    {
      heading: "What is a good profit margin?",
      body: [
        "It varies enormously by industry. Grocery stores often run net margins of a few percent on high volume, while software companies can have gross margins above 70%. Compare your margins with businesses of similar size in your industry and track the trend over time — a falling gross margin is often the earliest warning sign of pricing or cost problems.",
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Confusing margin with markup. A 50% markup is only a 33% margin.",
            "Leaving shipping, payment processing or returns out of COGS, which overstates gross margin.",
            "Mixing time periods — use revenue and costs for the same month, quarter or year.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "Taxes are a single flat rate applied to positive operating profit; interest, credits and loss carryforwards are not modeled.",
    "Revenue and costs are for the same period.",
  ],
  faqs: [
    {
      question: "What is the difference between gross and net profit margin?",
      answer: "Gross margin only subtracts the direct cost of what you sold. Net margin subtracts every expense, including overhead and taxes. Net margin is always lower unless you have no other expenses.",
    },
    {
      question: "How do I calculate profit margin from a price and cost?",
      answer: "Subtract the cost from the price and divide by the price. A product that sells for $50 and costs $30 has a margin of $20 ÷ $50 = 40%.",
    },
    {
      question: "Can profit margin be negative?",
      answer: "Yes. If costs exceed revenue, profit and margin are negative, which means the business or product is losing money at current prices and volumes.",
    },
  ],
};

export default content;
