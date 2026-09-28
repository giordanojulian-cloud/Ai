import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "ROI expresses profit as a percentage of what you put in. A 50% ROI means you ended up with one and a half times your total investment, counting income and costs.",
    "On its own, ROI ignores time: 50% over two years is far better than 50% over ten. The annualized ROI converts the result into an equivalent yearly compound rate, which makes investments of different lengths comparable.",
  ],
  howItWorks: [
    "The calculator adds any fees to your amount invested to get the total cost, and adds any income received to the final value to get the total return. The difference is your net gain, and ROI is that gain divided by the total cost.",
    "If you enter a holding period, it also calculates the compound annual growth rate that would turn the total cost into the total return over that time.",
  ],
  formulas: [
    { label: "Return on investment", expression: "ROI = (Final value + Income − Invested − Costs) ÷ (Invested + Costs)" },
    { label: "Annualized ROI (CAGR)", expression: "Annualized = (1 + ROI)^(1 ÷ years) − 1" },
  ],
  example: {
    title: "Example: $10,000 grows to $15,000 in 3 years",
    body: [
      {
        steps: [
          "Net gain = $15,000 − $10,000 = $5,000.",
          "ROI = $5,000 ÷ $10,000 = 50%.",
          "Annualized ROI = 1.5^(1/3) − 1 ≈ 14.47% per year.",
        ],
      },
      "If you had also paid $200 in fees and received $300 in dividends, the gain would be $5,100 on $10,200 of total cost, an ROI of exactly 50% again — the extra income offsets the costs.",
    ],
  },
  guide: [
    {
      heading: "Who this calculator is for",
      body: ["Investors evaluating a stock, fund, property or business purchase after the fact, and anyone comparing two investments held for different lengths of time."],
    },
    {
      heading: "Limitations of simple ROI",
      body: [
        {
          list: [
            "It assumes a single investment at the start and a single value at the end. If you added or withdrew money along the way, use a time-weighted or money-weighted return (IRR) instead.",
            "It ignores risk. A high ROI achieved with a volatile investment isn't directly comparable to a steady one.",
            "It's usually pre-tax. Taxes on gains and income can change the ranking of two investments.",
          ],
        },
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Leaving out costs such as commissions, closing costs or management fees, which inflates ROI.",
            "Forgetting income. Dividends and rent can be a large share of total return.",
            "Comparing total ROI across different time periods instead of annualized ROI.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "All money is invested at the start and the final value is measured at the end of the holding period.",
    "Income is added at face value without reinvestment or timing adjustments.",
    "Taxes and inflation are not considered.",
  ],
  faqs: [
    {
      question: "What is a good ROI?",
      answer:
        "It depends on the risk and the time period. Compare the annualized ROI to alternatives with similar risk — for example, a broad stock index fund for equity investments or a high-yield savings rate for low-risk money.",
    },
    {
      question: "What's the difference between ROI and annualized ROI?",
      answer: "ROI is the total return over the whole holding period. Annualized ROI is the constant yearly compound rate that would produce the same total return, which allows fair comparisons across time periods.",
    },
    {
      question: "Can ROI be negative?",
      answer: "Yes. If the total returned is less than the total cost, ROI is negative and represents a loss. The minimum is −100%, meaning the entire investment was lost.",
    },
    {
      question: "How is ROI different from profit margin?",
      answer: "ROI measures profit relative to the amount invested. Profit margin measures profit relative to revenue. A business can have a thin margin but a high ROI if it needs little capital.",
    },
  ],
};

export default content;
