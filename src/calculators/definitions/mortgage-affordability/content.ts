import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "The result is the highest home price whose full monthly payment — principal, interest, property tax, insurance, PMI and HOA — fits within the debt-to-income limits you set. It's the kind of ceiling a lender might approve, not a recommendation to spend that much.",
    "The 'limited by' figure tells you which rule is binding. If it's the total debt ratio, paying down other debts would raise your budget. If it's the housing ratio, a larger income, lower rate or lower property taxes would.",
  ],
  howItWorks: [
    "Your gross monthly income is multiplied by the front-end ratio to get the maximum housing payment, and by the back-end ratio (minus your other monthly debts) to get a second limit. The smaller of the two is your housing budget.",
    "The calculator then searches for the highest price whose complete monthly payment fits that budget. Property tax scales with the price, and PMI is added when your down payment is less than 20% of the price, so the payment is recalculated for every candidate price rather than using a shortcut formula.",
  ],
  formulas: [
    { label: "Housing budget", expression: "Budget = min(Income/12 × front ratio, Income/12 × back ratio − monthly debts)" },
    {
      label: "Monthly payment at price P",
      expression: "Payment(P) = PMT(P − D) + P × tax rate ÷ 12 + insurance ÷ 12 + HOA + PMI",
      variables: [
        { symbol: "D", meaning: "down payment" },
        { symbol: "PMT(L)", meaning: "monthly principal & interest on loan L" },
      ],
    },
    { label: "Maximum price", expression: "Largest P such that Payment(P) ≤ Budget" },
  ],
  example: {
    title: "Example: $100,000 income, $500 of debts, $40,000 down",
    body: [
      {
        steps: [
          "Monthly income is $8,333. The 28% housing limit is $2,333; the 36% total limit leaves $3,000 − $500 = $2,500. The housing limit is lower, so the budget is $2,333.",
          "At 6.5% for 30 years, 1.1% property tax, $1,800 insurance and 0.5% PMI, the highest price that fits is about $320,462.",
          "That price means a $280,462 loan with a payment of roughly $1,773 principal and interest, $294 tax, $150 insurance and $117 PMI.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Who this calculator is for",
      body: ["Prospective buyers setting a search budget before talking to a lender, and anyone weighing how debts, rates or a bigger down payment change what they can afford."],
    },
    {
      heading: "What lenders look at",
      body: [
        {
          list: [
            "Debt-to-income: 28/36 is a traditional guideline. Many loan programs allow back-end ratios of 43% or more, especially with strong credit or compensating factors.",
            "Credit score: affects your rate and PMI cost, which both change affordability.",
            "Cash reserves: some lenders want several months of payments in savings after closing.",
          ],
        },
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Treating the maximum as the target. A payment at your limit leaves little room for maintenance, savings and surprises.",
            "Using net pay. Debt-to-income ratios are based on gross (pre-tax) income.",
            "Forgetting closing costs and moving expenses, which come out of the same savings as your down payment.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "Fixed-rate loan with monthly payments; taxes, insurance and HOA stay constant.",
    "PMI applies when the loan exceeds 80% of the price, as a flat annual percentage of the loan.",
    "Debt-to-income limits are guidelines; actual approval depends on credit, reserves, loan program and lender overlays.",
    "Closing costs are not deducted from the down payment.",
  ],
  faqs: [
    {
      question: "What is the 28/36 rule?",
      answer: "It suggests spending no more than 28% of gross monthly income on housing and no more than 36% on housing plus all other debt payments. It's a traditional guideline for a comfortable budget, not a hard lending limit.",
    },
    {
      question: "How much house can I afford on a $100,000 salary?",
      answer: "With $40,000 down, $500 of monthly debts and a 6.5% rate, roughly $320,000 using the 28/36 guideline. Your result depends heavily on the rate, property taxes and existing debts — enter your own numbers above.",
    },
    {
      question: "Does a bigger down payment increase what I can afford?",
      answer: "Yes. It reduces the loan amount and, at 20% or more, removes PMI. Every dollar of down payment adds a dollar to the price you can afford, plus more if it eliminates PMI.",
    },
    {
      question: "Should I include my partner's income?",
      answer: "If you're applying jointly, lenders consider both incomes and both sets of debts. Include both consistently.",
    },
  ],
};

export default content;
