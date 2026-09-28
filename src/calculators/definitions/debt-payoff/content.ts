import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "Your debt-free date is how long it takes to clear every balance if you pay the same total amount each month — all minimum payments plus your extra payment. As each debt is paid off, its minimum payment rolls over to the next debt in line, so your payoff speeds up over time.",
    "Total interest is the cost of carrying the debt until it's gone. The comparison with minimum-only payments shows what your extra effort is worth in dollars and months.",
  ],
  howItWorks: [
    "The calculator simulates your debts month by month. Each month, interest is added to every balance at its APR divided by 12. Every open debt then receives its minimum payment, and whatever remains of your monthly budget goes to the priority debt.",
    "With the avalanche method, the priority debt is the one with the highest interest rate. With the snowball method, it's the one with the smallest balance. When a debt reaches zero, its payment is redirected to the next debt — the 'rollover' that gives both methods their momentum.",
  ],
  formulas: [
    { label: "Monthly interest on each debt", expression: "Interest = Balance × APR ÷ 12" },
    { label: "Monthly budget (constant)", expression: "Budget = Σ minimum payments + extra payment" },
    {
      label: "Single-debt payoff time (for reference)",
      expression: "n = −ln(1 − B × r ÷ P) ÷ ln(1 + r)",
      variables: [
        { symbol: "B", meaning: "balance" },
        { symbol: "r", meaning: "monthly rate (APR ÷ 12)" },
        { symbol: "P", meaning: "monthly payment" },
      ],
    },
  ],
  example: {
    title: "Example: three debts with $200 extra a month",
    body: [
      "Suppose you owe $6,000 on a credit card at 22.9% (minimum $180), $12,000 on a car loan at 7.5% ($350) and $18,000 on a student loan at 5.5% ($200). You add $200 a month, for a total of $930.",
      {
        steps: [
          "Avalanche targets the credit card first: it receives its $180 minimum plus the $200 extra each month.",
          "Once the card is paid off, its $380 rolls over to the car loan, which then receives $730 a month.",
          "After the car loan, the full $930 goes to the student loan until it's gone.",
        ],
      },
      "Enter these numbers to see the exact payoff dates and total interest, then switch to snowball to compare.",
    ],
  },
  guide: [
    {
      heading: "Avalanche or snowball?",
      body: [
        "Avalanche minimizes total interest because every extra dollar goes to the most expensive debt. Snowball clears small balances first, which produces quicker wins and can make it easier to stay motivated. When your highest-rate debt is also your smallest, both methods are identical.",
        "The best strategy is the one you'll stick with. This calculator shows the dollar cost of choosing snowball over avalanche for your debts, so you can decide whether the motivation is worth it.",
      ],
    },
    {
      heading: "Which inputs matter most",
      body: [
        {
          list: [
            "Extra payment: even modest amounts shorten payoff dramatically on high-rate debt.",
            "Interest rates: a 25% credit card costs roughly five times as much interest per dollar as a 5% loan.",
            "Keeping your payment constant: the rollover only works if you keep paying the same total after each debt is cleared.",
          ],
        },
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Adding new charges to cards you're paying off, which quietly extends your timeline.",
            "Entering the current statement minimum as fixed. Many credit card minimums shrink as balances fall; if you keep paying the original amount, you'll finish sooner than a minimum-only plan.",
            "Ignoring promotional rates that expire. If a 0% balance transfer ends in 12 months, model the rate it will revert to.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "Interest accrues monthly at APR ÷ 12 on each balance; daily-balance methods can differ slightly.",
    "Minimum payments are fixed amounts that do not decline as balances fall.",
    "No new charges, fees or rate changes during the payoff period.",
    "The total monthly budget stays constant and freed-up payments roll over to the next priority debt.",
    "The minimum-only comparison pays each debt's own minimum with no rollover.",
  ],
  faqs: [
    {
      question: "Which is better, the debt avalanche or the debt snowball?",
      answer:
        "Mathematically, the avalanche method always costs the same or less in interest. The snowball method can pay off individual accounts sooner, which some people find motivating. The calculator shows the difference for your specific debts.",
    },
    {
      question: "Should I pay off debt or save for emergencies first?",
      answer:
        "Many people keep a small emergency fund while paying off high-interest debt, so an unexpected expense doesn't go back on a credit card. The right balance depends on your job stability and other resources.",
    },
    {
      question: "Does debt consolidation help?",
      answer:
        "Consolidating into a single loan at a lower rate can reduce interest and simplify payments, but only if the new rate and fees are genuinely lower and you avoid running balances back up. Model the consolidation loan as a single debt to compare.",
    },
    {
      question: "Why does my payoff take longer than expected?",
      answer:
        "On high-interest debt, a large share of each payment goes to interest. If the total payment barely exceeds the monthly interest, progress is slow. Increasing the extra payment has the biggest effect in that situation.",
    },
  ],
};

export default content;
