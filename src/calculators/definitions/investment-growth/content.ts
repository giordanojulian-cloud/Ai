import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "The projected value shows what your portfolio would be worth if it earned the same average return every year. Real markets don't move in straight lines, so think of it as the midpoint of a wide range of possible outcomes rather than a forecast.",
    "The inflation-adjusted value is often the more useful number: it tells you what that future balance could buy in today's dollars. The cost of fees shows how much of your future wealth goes to fund managers and advisors instead of you.",
  ],
  howItWorks: [
    "Your expected annual return is treated as an effective annual rate and converted to an equivalent monthly rate. Each month the balance grows at that rate and your contribution is added at the month's end.",
    "Annual fees are subtracted from the return using (1 + return) × (1 − fee) − 1, which approximates an expense ratio charged on your balance. If you choose to increase contributions each year, the monthly amount steps up every 12 months. Finally, the ending balance is divided by cumulative inflation to express it in today's dollars.",
  ],
  formulas: [
    { label: "Net return after fees", expression: "r_net = (1 + r) × (1 − f) − 1" },
    { label: "Equivalent monthly return", expression: "i = (1 + r_net)^(1/12) − 1" },
    {
      label: "Monthly balance update",
      expression: "B(m) = B(m − 1) × (1 + i) + C × (1 + g)^⌊(m − 1)/12⌋",
      variables: [
        { symbol: "B(m)", meaning: "balance after month m" },
        { symbol: "C", meaning: "starting monthly contribution" },
        { symbol: "g", meaning: "annual contribution increase" },
      ],
    },
    { label: "Inflation-adjusted value", expression: "Real value = Final balance ÷ (1 + inflation)^years" },
  ],
  example: {
    title: "Example: $25,000 plus $500 a month for 25 years",
    body: [
      "Assume a 7% average annual return, 0.2% in annual fees and 2.5% inflation.",
      {
        steps: [
          "Net return: 1.07 × 0.998 − 1 = 6.786% per year, or about 0.549% per month.",
          "After 25 years, the starting $25,000 grows to roughly $129,000 and the $150,000 of monthly contributions grow to roughly $379,000, for a total of about $508,000.",
          "Fees cost about $18,800 of ending balance compared with a fee-free portfolio.",
          "Divided by 1.025^25 ≈ 1.854, the balance is worth roughly $274,000 in today's dollars.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Who this calculator is for",
      body: [
        "Long-term investors planning for retirement or financial independence, anyone comparing a low-cost index fund with a higher-fee option, and people deciding how much to invest each month.",
      ],
    },
    {
      heading: "Choosing a realistic return",
      body: [
        "Broad U.S. stock indexes have historically returned roughly 10% a year before inflation over very long periods, with large swings from year to year and decades that were much weaker. Diversified portfolios with bonds have returned less. Many planners use 5–7% for stock-heavy portfolios to stay conservative. Try several rates to see the range of outcomes.",
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Mixing nominal and real numbers. If you enter a return that already subtracts inflation, set inflation to 0 to avoid double counting.",
            "Underestimating fees. A 1% advisory fee on top of fund expenses can consume a large share of long-term growth.",
            "Assuming smooth returns when withdrawing. Once you start withdrawing, the order of good and bad years matters a lot; this calculator models the accumulation phase only.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "A constant average annual return every year; real returns vary and can be negative.",
    "Contributions are made at the end of each month and increase once per year if you set an increase.",
    "Fees are modeled as an annual percentage of assets that reduces the return.",
    "Taxes on dividends, interest and gains are not modeled.",
    "Inflation is constant and is only used to express the final balance in today's dollars.",
  ],
  faqs: [
    {
      question: "What return should I use?",
      answer:
        "Use a long-term average that matches your mix of investments, and test a lower and higher rate as well. A range of results is more informative than a single projection.",
    },
    {
      question: "Why does the inflation-adjusted value matter?",
      answer:
        "A dollar in 25 years will buy less than a dollar today. Adjusting for inflation shows the purchasing power of your future balance, which is what matters for goals like retirement income.",
    },
    {
      question: "How much do fees really cost?",
      answer:
        "Fees compound just like returns. Over decades, even a difference of half a percentage point can reduce your ending balance by a meaningful percentage. The 'Cost of fees' result shows this in dollars for your inputs.",
    },
    {
      question: "Does this include taxes?",
      answer:
        "No. Tax-advantaged accounts such as 401(k)s and IRAs defer or eliminate taxes on growth, while taxable accounts owe tax on dividends and realized gains. Your after-tax result depends on the account type and your tax situation.",
    },
  ],
};

export default content;
