import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "The estimated monthly payment is what you would send your servicer each month if taxes and insurance are collected through an escrow account, which is how most mortgages work. It combines four core pieces — principal, interest, taxes and insurance (often shortened to PITI) — plus private mortgage insurance and HOA dues when they apply.",
    "Only principal and interest are fixed for the life of a fixed-rate loan. Property taxes, insurance premiums and HOA dues usually rise over time, so your real payment will likely drift upward even though the loan payment itself does not change.",
    "Total interest shows the cost of borrowing. On a 30-year loan it frequently rivals the original loan amount, which is why rate, term and extra payments deserve close attention.",
  ],
  howItWorks: [
    "The calculator first subtracts your down payment from the home price to get the loan amount. It then applies the standard amortization formula to find the fixed monthly principal-and-interest payment that pays the loan off exactly over the term you selected.",
    "Property tax and homeowners insurance are entered as annual amounts (or, for tax, a percentage of the home price) and divided by 12. If your down payment is under 20%, private mortgage insurance is estimated as an annual percentage of the loan amount, divided by 12, and removed once the balance reaches 78% of the original home price.",
    "The amortization schedule is built month by month: each month, interest is charged on the remaining balance, the rest of the payment reduces principal, and any extra payment you enter goes straight to principal.",
  ],
  formulas: [
    {
      label: "Monthly principal & interest",
      expression: "M = P × r(1 + r)^n ÷ ((1 + r)^n − 1)",
      variables: [
        { symbol: "M", meaning: "monthly principal and interest payment" },
        { symbol: "P", meaning: "loan amount (home price − down payment)" },
        { symbol: "r", meaning: "monthly interest rate (annual rate ÷ 12)" },
        { symbol: "n", meaning: "number of monthly payments (years × 12)" },
      ],
    },
    {
      label: "Estimated total monthly payment",
      expression: "Total = M + (annual property tax ÷ 12) + (annual insurance ÷ 12) + PMI + HOA",
    },
    {
      label: "Monthly PMI (when down payment < 20%)",
      expression: "PMI = loan amount × annual PMI rate ÷ 12",
    },
  ],
  example: {
    title: "Example: $400,000 home with 20% down",
    body: [
      "A buyer puts 20% ($80,000) down on a $400,000 home, borrowing $320,000 at 6.5% for 30 years.",
      {
        steps: [
          "Monthly rate r = 6.5% ÷ 12 = 0.0054167, and n = 30 × 12 = 360 payments.",
          "Principal and interest M = 320,000 × 0.0054167 × 1.0054167^360 ÷ (1.0054167^360 − 1) ≈ $2,022.62.",
          "Property tax at 1.1% is $4,400 per year, or $366.67 per month. Insurance of $1,800 per year adds $150 per month.",
          "With 20% down there is no PMI, so the estimated total is about $2,539.28 per month (components are rounded individually above).",
        ],
      },
      "Over 30 years the buyer would pay roughly $408,000 in interest — more than the amount originally borrowed.",
    ],
  },
  guide: [
    {
      heading: "Who this calculator is for",
      body: [
        "First-time buyers estimating what a listing will really cost each month, current owners comparing a refinance or a shorter term, and anyone who wants to see how extra principal payments change a payoff date.",
      ],
    },
    {
      heading: "Which inputs matter most",
      body: [
        {
          list: [
            "Interest rate: on a $320,000 30-year loan, each 0.5 percentage point changes the payment by roughly $100 per month and total interest by more than $35,000.",
            "Loan term: a 15-year term carries a much higher monthly payment but typically cuts total interest by more than half.",
            "Down payment: below 20%, it also determines whether you pay PMI.",
            "Property tax: rates vary from under 0.5% to over 2% of value depending on location, which can swing the payment by hundreds of dollars.",
          ],
        },
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Budgeting on principal and interest alone. Taxes and insurance often add 20–35% to the payment.",
            "Using the APR as the interest rate. APR includes fees and is meant for comparing offers; the note rate determines your payment.",
            "Assuming taxes stay fixed. Many areas reassess after a sale, so the seller's tax bill may understate yours.",
            "Forgetting closing costs and cash reserves. The down payment is not the only cash you need at closing.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "Fixed interest rate for the full term; adjustable-rate loans are not modeled.",
    "Payments are made monthly, with interest calculated monthly on the outstanding balance.",
    "Property tax, insurance and HOA dues are held constant for the life of the loan.",
    "PMI is only applied when the loan exceeds 80% of the home price, is a flat percentage of the original loan amount, and ends automatically when the balance falls to 78% of the original price (the Homeowners Protection Act threshold). Your lender's PMI pricing and cancellation terms may differ.",
    "Closing costs, points and lender fees are not included in the payment.",
  ],
  faqs: [
    {
      question: "What is included in a mortgage payment?",
      answer:
        "Most payments include principal and interest on the loan, plus one-twelfth of your annual property tax and homeowners insurance collected into escrow. Private mortgage insurance and HOA dues may also apply. HOA dues are often paid directly to the association, but they belong in your housing budget either way.",
    },
    {
      question: "How can I avoid paying PMI?",
      answer:
        "On a conventional loan, putting at least 20% down avoids PMI. If you put less down, PMI can be removed once your balance reaches 80% of the original value (on request) and ends automatically at 78% under federal law, provided you are current on payments. Some lenders offer lender-paid PMI in exchange for a higher rate.",
    },
    {
      question: "Is a 15-year or 30-year mortgage better?",
      answer:
        "Neither is universally better. A 15-year loan usually has a lower rate and far less total interest, but a much higher monthly payment. A 30-year loan keeps the required payment lower and preserves flexibility — you can still pay extra when you choose. Use the extra payment field to compare the two approaches.",
    },
    {
      question: "How much do extra payments save?",
      answer:
        "Extra principal reduces the balance that interest is charged on, so savings compound. Enter an amount in the extra payment field to see the interest saved and how much sooner the loan is paid off. Confirm with your servicer that extra payments are applied to principal.",
    },
    {
      question: "Why is my lender's estimate different from this calculator?",
      answer:
        "Lenders use your exact tax bill, insurance quote, PMI pricing based on credit score, and may include escrow cushions or prepaid items. This calculator uses the figures you enter and standard formulas, so it is best used for planning and comparing scenarios.",
    },
  ],
  sources: [
    {
      label: "CFPB: What is private mortgage insurance?",
      url: "https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/",
    },
  ],
};

export default content;
