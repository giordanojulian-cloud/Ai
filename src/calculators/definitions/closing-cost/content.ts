import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "Closing costs are the fees and prepaid expenses due when you finalize a home purchase, separate from your down payment. For buyers they commonly run from about 2% to 5% of the price, depending on the loan, the state and how much you prepay.",
    "Cash needed at closing is the number to plan your savings around: down payment plus closing costs. Seller credits, lender credits or assistance programs can reduce it.",
  ],
  howItWorks: [
    "The calculator adds up each line item you enter. Percentage-based items use the right base: origination fees and points are a percentage of the loan amount, while title insurance and transfer taxes are a percentage of the price.",
    "Prepaid interest covers the days from closing to the end of that month, calculated as the loan amount times the annual rate divided by 365, times the number of days. Insurance and tax escrow are the number of months you prepay times the monthly amount.",
  ],
  formulas: [
    { label: "Loan-based fees", expression: "Origination = Loan × origination % · Points = Loan × points × 1%" },
    { label: "Price-based fees", expression: "Title insurance = Price × title % · Transfer tax = Price × transfer tax %" },
    { label: "Prepaid interest", expression: "Loan × annual rate ÷ 365 × days" },
    { label: "Cash to close", expression: "Down payment + Σ closing cost items" },
  ],
  example: {
    title: "Example: $400,000 home with 20% down",
    body: [
      {
        steps: [
          "Loan amount: $320,000. A 1% origination fee is $3,200; appraisal, credit report and other lender fees add $1,650.",
          "Title insurance at 0.5% is $2,000, plus $750 settlement and $250 recording fees.",
          "A $450 inspection, 15 days of prepaid interest at 6.5% ($854.79), 12 months of insurance ($1,800) and 3 months of tax escrow ($1,100).",
          "Total closing costs: about $12,054.79, or 3.01% of the price. Cash needed at closing: about $92,054.79.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Who this calculator is for",
      body: ["Home buyers planning how much cash to save, and anyone comparing Loan Estimates from different lenders."],
    },
    {
      heading: "How to lower closing costs",
      body: [
        {
          list: [
            "Compare Loan Estimates from several lenders — fees in section A (origination charges) vary most.",
            "Shop for services the lender lets you choose, such as title insurance and settlement.",
            "Negotiate seller credits, especially in slower markets.",
            "Close near the end of the month to reduce prepaid interest (it doesn't lower total interest, only the amount due at closing).",
          ],
        },
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Budgeting only for the down payment.",
            "Assuming the seller pays transfer taxes. Who pays varies by state and by contract.",
            "Buying discount points without checking the break-even period — points only pay off if you keep the loan long enough.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "Default amounts are illustrative national-style figures; actual fees vary by lender, state, county and property.",
    "Transfer taxes default to 0% because many areas assign them to the seller; enter your local rate if you'll pay them.",
    "Prepaid interest uses a 365-day year. Escrow deposit requirements depend on your servicer and tax due dates.",
    "Seller credits, lender credits and assistance programs are not deducted.",
  ],
  faqs: [
    {
      question: "How much are closing costs for a buyer?",
      answer: "Typically around 2–5% of the purchase price, though the total depends heavily on location, loan type and how much is prepaid into escrow.",
    },
    {
      question: "Can closing costs be rolled into the mortgage?",
      answer: "On a purchase, closing costs usually can't be added to the loan directly, but you can reduce cash due with seller credits or a lender credit in exchange for a higher rate. Refinances often allow financing closing costs.",
    },
    {
      question: "What are prepaids?",
      answer: "Prepaids are costs paid in advance at closing — mortgage interest for the rest of the month, the first year of homeowners insurance and an initial deposit into your escrow account for taxes and insurance.",
    },
    {
      question: "Where do I find my actual closing costs?",
      answer: "Your lender provides a Loan Estimate within three business days of your application and a Closing Disclosure at least three business days before closing. Compare them line by line.",
    },
  ],
  sources: [{ label: "CFPB: Loan Estimate explainer", url: "https://www.consumerfinance.gov/owning-a-home/loan-estimate/" }],
};

export default content;
