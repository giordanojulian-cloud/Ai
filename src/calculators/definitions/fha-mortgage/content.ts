import type { CalculatorContent } from "../../types";
import { FHA_RULES } from "./fha-rules";

const content: CalculatorContent = {
  whatItMeans: [
    "The estimated payment is what an FHA borrower would typically pay each month in the first year: principal and interest, the monthly share of annual mortgage insurance premium (MIP), property tax, homeowners insurance and any HOA dues.",
    "FHA loans charge two kinds of mortgage insurance. The upfront premium is a one-time charge, usually added to the loan. The annual premium is paid monthly and, with less than 10% down, lasts for the life of the loan — the main cost difference between FHA and conventional loans.",
  ],
  howItWorks: [
    "The base loan is the purchase price minus your down payment. The upfront MIP is a percentage of the base loan; if you finance it, it's added to the loan amount before the payment is calculated.",
    `By default, the annual MIP rate is looked up from the HUD table effective ${FHA_RULES.effectiveDate}, based on your loan term, loan amount and loan-to-value ratio. Each loan year, the premium is estimated from the average scheduled balance and divided into 12 monthly charges. With 10% or more down, MIP stops after 11 years; otherwise it continues for the full term.`,
  ],
  formulas: [
    { label: "Loan amounts", expression: "Base loan = Price − Down payment · Upfront MIP = Base loan × 1.75% · Total loan = Base loan + Upfront MIP" },
    { label: "Principal & interest", expression: "M = L × r(1 + r)^n ÷ ((1 + r)^n − 1)", variables: [{ symbol: "L", meaning: "total loan amount" }] },
    { label: "Monthly MIP for a loan year", expression: "MIP = Annual MIP rate × Average balance for the year ÷ 12" },
  ],
  example: {
    title: "Example: $350,000 home with 3.5% down",
    body: [
      {
        steps: [
          "Down payment: $12,250. Base loan: $337,750 (96.5% LTV).",
          "Upfront MIP: $337,750 × 1.75% = $5,910.63, financed for a total loan of $343,660.63.",
          "At 6.25% for 30 years, principal and interest is about $2,115.98 per month.",
          "LTV is above 95%, so the annual MIP rate is 0.55%. On the first year's average balance of about $341,800, that's roughly $156.67 per month.",
        ],
      },
      "Add property tax and insurance to get the full estimated payment. Because the down payment is under 10%, MIP remains for the life of the loan.",
    ],
  },
  guide: [
    {
      heading: "Who FHA loans are for",
      body: [
        "FHA loans are insured by the Federal Housing Administration and allow lower down payments and credit scores than most conventional loans. They're popular with first-time buyers and borrowers rebuilding credit. The property must be your primary residence and meet FHA appraisal standards.",
      ],
    },
    {
      heading: "FHA vs. conventional loans",
      body: [
        {
          list: [
            "With a strong credit score and 5–10% down, a conventional loan's PMI is often cheaper than FHA MIP, and PMI can be removed once you reach 20% equity.",
            "With lower credit scores, FHA pricing is frequently better, because FHA MIP does not rise as steeply with lower scores.",
            "Many borrowers use FHA to buy, then refinance to a conventional loan once they have enough equity to drop mortgage insurance.",
          ],
        },
        "Compare both with the mortgage calculator using your own numbers.",
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Assuming MIP disappears at 20% equity. On FHA loans with under 10% down, it doesn't — you'd need to refinance.",
            "Forgetting the upfront premium. Financing it increases the loan amount and the interest you pay on it.",
            "Ignoring county loan limits, which cap how much you can borrow with FHA.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    `MIP rates and rules follow ${FHA_RULES.source}, effective ${FHA_RULES.effectiveDate}. HUD can change them; confirm current rates with a lender.`,
    "Annual MIP is estimated from the average scheduled balance of each loan year; your servicer's exact calculation may differ slightly.",
    "Fixed rate, monthly payments and constant taxes, insurance and HOA dues.",
    "County FHA loan limits, credit-score requirements and debt-to-income limits are not enforced.",
    "Closing costs other than the upfront MIP are not included.",
  ],
  faqs: [
    {
      question: "What is the current FHA MIP rate?",
      answer: `For most 30-year FHA loans under $726,200, the annual MIP is 0.55% with less than 5% down and 0.50% with 5% or more down, following ${FHA_RULES.source}. The upfront premium is 1.75% of the base loan.`,
    },
    {
      question: "Can I remove FHA mortgage insurance?",
      answer: "If you put at least 10% down, annual MIP ends after 11 years. With less than 10% down, it lasts for the life of the loan, and the usual way to remove it is to refinance into a conventional loan.",
    },
    {
      question: "What credit score do I need for an FHA loan?",
      answer: "FHA guidelines allow 3.5% down with a credit score of 580 or higher and 10% down with scores from 500 to 579. Individual lenders often set higher minimums.",
    },
    {
      question: "Can the seller pay my FHA closing costs?",
      answer: "FHA rules allow sellers to contribute up to 6% of the sales price toward eligible closing costs, which can reduce the cash you need at closing.",
    },
  ],
  sources: [
    { label: "HUD: FHA Single Family Housing", url: "https://www.hud.gov/program_offices/housing/sfh" },
    { label: `${FHA_RULES.source}`, url: FHA_RULES.sourceUrl },
  ],
};

export default content;
