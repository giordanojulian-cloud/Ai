import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "The monthly amount is the fixed deposit that, together with your current savings and the interest they earn, reaches your goal exactly on the target date. If you can save a little more, you'll get there sooner; if the number is uncomfortable, extending the timeline is usually the most effective lever.",
    "Interest earned shows how much of the goal is funded by your savings rate rather than your deposits. For short goals it's modest; for longer goals it can be substantial.",
  ],
  howItWorks: [
    "First, the calculator projects how much your current savings will grow to by the target date on their own. The remaining gap is what monthly deposits need to cover.",
    "It then solves for the fixed end-of-month deposit whose future value — at the monthly rate equivalent to your APY — exactly fills that gap. If current savings already cover the goal, the required deposit is zero.",
  ],
  formulas: [
    { label: "Monthly rate from APY", expression: "i = (1 + APY)^(1/12) − 1" },
    {
      label: "Required monthly deposit",
      expression: "PMT = (Goal − PV × (1 + i)^n) × i ÷ ((1 + i)^n − 1)",
      variables: [
        { symbol: "PV", meaning: "current savings" },
        { symbol: "n", meaning: "months until the goal" },
      ],
    },
  ],
  example: {
    title: "Example: $20,000 in 3 years",
    body: [
      "You have $2,000 saved and want $20,000 in three years in an account paying 4.5% APY.",
      {
        steps: [
          "The monthly rate is 1.045^(1/12) − 1 ≈ 0.3675%.",
          "Your $2,000 grows to about $2,282 by itself, leaving a gap of roughly $17,718.",
          "Solving for the deposit gives about $461.22 per month.",
          "Over 36 months you deposit about $16,604, and interest adds about $1,396.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Who this calculator is for",
      body: ["Anyone saving toward a defined target: an emergency fund, a home down payment, a car, a wedding, tuition or a major trip."],
    },
    {
      heading: "Tips for reaching your goal",
      body: [
        {
          list: [
            "Automate the deposit on payday so saving happens before spending.",
            "Keep short-term goals (under about five years) in insured savings or similar low-risk accounts rather than stocks.",
            "Revisit the plan when rates change — a lower APY means a slightly higher required deposit.",
          ],
        },
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Using an investment return for a short-term goal. Market losses near your deadline can derail the plan.",
            "Forgetting taxes on interest, which slightly reduce what you keep in a regular savings account.",
            "Setting the goal without a buffer. Prices for big purchases often rise while you save.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "Deposits are equal and made at the end of each month.",
    "The APY stays constant and interest is left in the account.",
    "Taxes on interest are not deducted.",
    "The time period is rounded to the nearest whole month.",
  ],
  faqs: [
    {
      question: "How much should I keep in an emergency fund?",
      answer:
        "A common guideline is three to six months of essential expenses, with more if your income is irregular. Enter that amount as your goal to see the monthly savings required.",
    },
    {
      question: "Should I save or invest for my goal?",
      answer:
        "For goals within a few years, most people prioritize stability and use savings accounts, CDs or Treasury bills. For goals many years away, investing may be appropriate. Use the investment growth calculator for long horizons.",
    },
    {
      question: "What if I can't afford the monthly amount?",
      answer: "Extend the timeline, lower the goal, or start with a smaller amount and increase it as your budget allows. Even partial progress reduces future borrowing.",
    },
  ],
};

export default content;
