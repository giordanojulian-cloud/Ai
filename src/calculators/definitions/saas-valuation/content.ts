import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "The estimate multiplies your annual recurring revenue (and, separately, your annual profit) by the multiples you enter. It shows the range a buyer or investor might discuss — not what a buyer will pay. The multiple is the key assumption, so choose it from comparable transactions, broker reports or advisor input.",
    "Revenue multiples are typical for fast-growing SaaS companies, where profits are reinvested in growth. Profit multiples (often on EBITDA or seller's discretionary earnings) are typical for smaller or mature businesses. Seeing both side by side shows how much of the value depends on growth.",
  ],
  howItWorks: [
    "ARR is MRR × 12. Annual profit is ARR × your net profit margin. The revenue-based valuation is ARR × the ARR multiple; the profit-based valuation is annual profit × the profit multiple.",
    "The conservative and aggressive scenarios scale both multiples down and up by the scenario range you choose (25% by default), making the assumption explicit rather than hidden. The calculator also reports metrics that commonly move multiples: annualized churn, forward ARR and the Rule of 40.",
  ],
  formulas: [
    { label: "Annual recurring revenue", expression: "ARR = MRR × 12" },
    { label: "Valuations", expression: "Revenue-based = ARR × ARR multiple · Profit-based = ARR × net margin × Profit multiple" },
    { label: "Scenarios", expression: "Conservative = multiples × (1 − range) · Aggressive = multiples × (1 + range)" },
    { label: "Annualized churn", expression: "Annual churn = 1 − (1 − monthly churn)^12" },
    { label: "Rule of 40", expression: "Score = Annual growth % + Profit margin %" },
  ],
  example: {
    title: "Example: $50,000 MRR",
    body: [
      {
        steps: [
          "ARR = $50,000 × 12 = $600,000. At a 15% net margin, annual profit is $90,000.",
          "At 5× ARR, the revenue-based estimate is $3,000,000. At 15× profit, the profit-based estimate is $1,350,000.",
          "With a 25% range, the conservative scenario uses 3.75× ARR ($2,250,000) and the aggressive scenario 6.25× ARR ($3,750,000).",
          "2% monthly churn compounds to about 21.5% a year, and the Rule of 40 score is 40% + 15% = 55%.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "What drives SaaS multiples",
      body: [
        {
          list: [
            "Growth rate — usually the single biggest driver for venture-scale companies.",
            "Retention — low churn and net revenue retention above 100% signal durable revenue.",
            "Gross margin — software gross margins of 70–80%+ support higher multiples.",
            "Size and concentration — larger companies and diversified customer bases get premium pricing; reliance on a few customers or the founder reduces it.",
          ],
        },
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Applying public-company multiples to a small private business. Small SaaS acquisitions typically trade at much lower multiples.",
            "Counting one-time or services revenue as recurring.",
            "Ignoring churn. High churn can erase the value of fast top-line growth.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "Valuation equals a multiple of current ARR or current annual profit; no discounted cash flow is performed.",
    "Negative profit produces a profit-based valuation of zero.",
    "Scenario spreads are symmetric adjustments to your chosen multiples, not market data.",
    "This is an educational estimate, not a professional business valuation or fairness opinion.",
  ],
  faqs: [
    {
      question: "What multiple should I use?",
      answer: "Use recent transactions for companies of similar size, growth and retention. Marketplace listings, M&A advisors and published SaaS indices are common sources. Small bootstrapped SaaS businesses often sell for low single-digit ARR multiples or a multiple of profit, while high-growth venture-backed companies can command much more.",
    },
    {
      question: "Should I use ARR or profit to value my company?",
      answer: "Buyers generally use revenue multiples for companies prioritizing growth and profit multiples for mature, profitable ones. Many look at both — this calculator shows them side by side.",
    },
    {
      question: "How does churn affect valuation?",
      answer: "Churn reduces the lifetime value of every customer and makes future revenue less certain. Two companies with the same ARR can receive very different multiples if one retains customers much better.",
    },
  ],
};

export default content;
