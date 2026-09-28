import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "Monthly cash flow is what's left from the rent after vacancy, every operating expense and the mortgage payment. Positive cash flow means the property pays for itself; negative cash flow means you'd subsidize it each month and rely on appreciation or loan paydown for your return.",
    "Cap rate describes the property's income relative to its price, independent of financing — useful for comparing properties. Cash-on-cash return describes your cash yield on the money you actually put in, which is what financing changes.",
  ],
  howItWorks: [
    "Gross scheduled rent is reduced by the vacancy rate to get effective gross income. Operating expenses — taxes, insurance, HOA, maintenance (a percentage of gross rent), management (a percentage of collected rent), utilities and other costs — are subtracted to get net operating income (NOI).",
    "The mortgage payment is calculated with the standard amortization formula. Subtracting a year of payments from NOI gives annual pre-tax cash flow. Cash invested is the down payment plus closing and rehab costs.",
  ],
  formulas: [
    { label: "Effective gross income", expression: "EGI = Monthly rent × 12 × (1 − vacancy rate)" },
    { label: "Net operating income", expression: "NOI = EGI − Operating expenses" },
    { label: "Cash flow", expression: "Annual cash flow = NOI − Annual debt service" },
    { label: "Cap rate", expression: "Cap rate = NOI ÷ Purchase price" },
    { label: "Cash-on-cash return", expression: "CoC = Annual cash flow ÷ (Down payment + Closing costs + Rehab)" },
    { label: "Debt service coverage", expression: "DSCR = NOI ÷ Annual debt service" },
  ],
  example: {
    title: "Example: $300,000 rental renting for $2,800",
    body: [
      "The buyer puts 25% down ($75,000) at 7% for 30 years, pays $9,000 in closing costs and $10,000 for repairs.",
      {
        steps: [
          "Gross rent is $33,600 a year; with 5% vacancy, effective income is $31,920.",
          "Expenses: $3,600 tax, $1,500 insurance, $1,680 maintenance (5% of gross), $2,553.60 management (8% of collected) and $1,200 other — $10,533.60 in total.",
          "NOI is $21,386.40, a 7.13% cap rate.",
          "The $225,000 loan costs $1,496.93 a month ($17,963.16 a year), leaving $3,423.23 of annual cash flow — about $285 a month.",
          "On $94,000 of cash invested, that's a 3.64% cash-on-cash return, with a DSCR of about 1.19.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Who this calculator is for",
      body: ["Buy-and-hold investors screening listings, house hackers estimating whether rent covers the mortgage, and landlords checking an existing property's performance."],
    },
    {
      heading: "Estimating expenses realistically",
      body: [
        {
          list: [
            "Vacancy: 5–8% is a common starting point; use local data for your market and property type.",
            "Maintenance and capital expenditures: older properties often need 10% or more of rent set aside for repairs and eventual replacements like roofs and HVAC.",
            "Management: professional managers commonly charge 8–12% of collected rent, plus leasing fees. Even if you self-manage, pricing in your time keeps the analysis honest.",
            "Property taxes may be reassessed after purchase; use the tax on your purchase price, not the seller's bill.",
          ],
        },
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Leaving out vacancy and capital expenditures, which makes almost any property look profitable.",
            "Confusing cap rate with cash-on-cash return. Leverage changes cash-on-cash but not cap rate.",
            "Ignoring the full return picture. Cash flow excludes loan paydown, appreciation and tax effects such as depreciation, which can matter as much as cash flow.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "Year-one figures only: rent, expenses and vacancy are held constant; appreciation and rent growth are not modeled.",
    "Maintenance is a percentage of gross scheduled rent; management is a percentage of collected rent.",
    "Cash flow is before income taxes; depreciation and other tax effects are excluded.",
    "Cap rate uses the purchase price, not price plus rehab.",
    "Fixed-rate financing with monthly payments.",
  ],
  faqs: [
    {
      question: "What is a good cash-on-cash return?",
      answer: "Many investors target 8–12%, but acceptable returns depend on the market, the property's risk and how much appreciation you expect. Lower cash-on-cash in exchange for a stable, appreciating area can still be a reasonable trade-off.",
    },
    {
      question: "What is the 1% rule?",
      answer: "A quick screen suggesting monthly rent should be at least 1% of the purchase price. It's a rough filter only: in many high-cost markets few properties meet it, and it ignores taxes, insurance and financing.",
    },
    {
      question: "Why is my cash flow negative?",
      answer: "Usually because the mortgage payment is large relative to the rent — common with high rates, low down payments or expensive markets. A larger down payment, lower price or higher rent changes the result; the tool shows how much each matters.",
    },
    {
      question: "Does cash flow include principal paydown?",
      answer: "No. Principal repaid is part of your debt service, so it reduces cash flow, even though it builds equity. Your total return includes that equity growth plus appreciation.",
    },
  ],
};

export default content;
