import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "The final balance is what your money would be worth if the rate stayed constant for the whole period and every contribution was made on schedule. It separates what you put in from what compounding added, so you can see how much of the result is genuinely earned growth.",
    "Compound interest means you earn interest on previously earned interest. Early on, growth is driven mostly by your contributions. Over longer periods, interest becomes the dominant source of growth — which is why time in the account matters as much as the rate.",
  ],
  howItWorks: [
    "Each month, the calculator applies interest to the current balance and adds your monthly contribution (at the start or end of the month, depending on your choice). It repeats this for every month in the period and records a year-by-year summary.",
    "Because contributions are monthly but interest may compound daily, quarterly or annually, the nominal rate is converted to an equivalent monthly rate that produces exactly the same growth as the compounding schedule you picked. The initial deposit therefore grows exactly as the textbook formula A = P(1 + r/n)^(nt) says it should.",
  ],
  formulas: [
    {
      label: "Growth of a single deposit",
      expression: "A = P × (1 + r/n)^(n × t)",
      variables: [
        { symbol: "A", meaning: "ending balance" },
        { symbol: "P", meaning: "initial deposit" },
        { symbol: "r", meaning: "annual interest rate (decimal)" },
        { symbol: "n", meaning: "compounding periods per year" },
        { symbol: "t", meaning: "years" },
      ],
    },
    {
      label: "Equivalent monthly rate for contributions",
      expression: "i = (1 + r/n)^(n/12) − 1   (continuous: i = e^(r/12) − 1)",
    },
    {
      label: "Future value of monthly contributions",
      expression: "FV = PMT × ((1 + i)^m − 1) ÷ i   (× (1 + i) if made at the start of each month)",
      variables: [
        { symbol: "PMT", meaning: "monthly contribution" },
        { symbol: "m", meaning: "number of months (t × 12)" },
      ],
    },
  ],
  example: {
    title: "Example: $10,000 plus $100 a month at 5%",
    body: [
      "You deposit $10,000 and add $100 at the end of every month for 10 years at 5% compounded monthly.",
      {
        steps: [
          "The deposit grows to 10,000 × (1 + 0.05/12)^120 ≈ $16,470.09.",
          "The monthly rate is 0.05/12 ≈ 0.0041667, so contributions grow to 100 × (1.0041667^120 − 1) ÷ 0.0041667 ≈ $15,528.23.",
          "The total balance is about $31,998.32. You contributed $22,000, so compounding added roughly $9,998.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Who this calculator is for",
      body: [
        "Savers comparing high-yield accounts or CDs, parents estimating how a college fund might grow, and anyone who wants to understand how much time and consistency contribute to long-term growth.",
      ],
    },
    {
      heading: "Which inputs matter most",
      body: [
        {
          list: [
            "Time: doubling the number of years usually much more than doubles the interest earned.",
            "Rate: a few percentage points compounds into large differences over decades.",
            "Contributions: steady monthly additions often matter more than the size of the initial deposit.",
            "Compounding frequency: it matters far less than people expect. At 5%, moving from monthly to daily compounding changes the effective rate by about 0.01 percentage points.",
          ],
        },
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Confusing APR and APY. Banks advertise savings rates as APY, which already includes compounding. If you have an APY, enter it with annual compounding.",
            "Ignoring inflation and taxes. A 5% return with 3% inflation is roughly 2% of real growth, and interest in taxable accounts is usually taxed each year.",
            "Assuming investment returns are constant. Stock returns vary widely year to year; use a conservative average and treat results as a range.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "The interest rate is constant for the full period.",
    "Contributions are the same amount every month and are made on time.",
    "Interest is not withdrawn and taxes and fees are not deducted.",
    "Contributions are monthly; the nominal rate is converted to an equivalent monthly rate for the selected compounding frequency.",
  ],
  faqs: [
    {
      question: "What is the difference between simple and compound interest?",
      answer:
        "Simple interest is earned only on the original principal. Compound interest is earned on the principal plus all interest already credited, so the amount of interest grows each period.",
    },
    {
      question: "How often should interest compound?",
      answer:
        "More frequent compounding produces slightly more interest, but the effect is small at typical rates. The annual rate and the time invested have a far bigger impact on the result.",
    },
    {
      question: "What is the rule of 72?",
      answer:
        "Divide 72 by the annual rate to estimate how many years it takes money to double. At 6%, money doubles in about 12 years. It is an approximation that works best for rates between about 4% and 12%.",
    },
    {
      question: "Should I enter APR or APY?",
      answer:
        "If your bank quotes an APY, enter it and choose annual compounding, because APY already reflects compounding. If you have a nominal rate (APR) and know the compounding schedule, enter the rate and select that schedule.",
    },
  ],
};

export default content;
