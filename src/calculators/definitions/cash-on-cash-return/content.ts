import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "Cash-on-cash return tells you how hard the money you actually put into a property is working. A 6% cash-on-cash return means every $100 you invested produces $6 of cash each year, before income taxes.",
    "Because it's based on cash invested rather than the property price, it reflects your financing. More leverage usually raises cash-on-cash return when the property's yield exceeds your borrowing cost — and lowers it when it doesn't.",
  ],
  howItWorks: [
    "Total cash invested is your down payment plus closing costs and any repairs or other upfront spending. Annual cash flow is rental income after vacancy, minus operating expenses (which gives net operating income), minus twelve mortgage payments.",
    "Dividing annual cash flow by total cash invested gives the cash-on-cash return. The payback period divides cash invested by annual cash flow.",
  ],
  formulas: [
    { label: "Annual cash flow", expression: "Cash flow = Rent × (1 − vacancy) − Operating expenses − Mortgage payment × 12" },
    { label: "Cash-on-cash return", expression: "CoC = Annual cash flow ÷ (Down payment + Closing costs + Upfront repairs)" },
  ],
  example: {
    title: "Example: $70,000 invested",
    body: [
      {
        steps: [
          "Cash invested: $60,000 down + $6,000 closing + $4,000 repairs = $70,000.",
          "Rent of $30,000 less 5% vacancy is $28,500; minus $9,000 of expenses leaves NOI of $19,500.",
          "Mortgage payments of $1,300 a month total $15,600, leaving $3,900 of annual cash flow.",
          "Cash-on-cash return = $3,900 ÷ $70,000 ≈ 5.57%.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Who this calculator is for",
      body: ["Rental investors comparing deals with different down payments, and anyone deciding whether to pay cash or finance a property."],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Forgetting closing and repair costs in the denominator, which overstates the return.",
            "Using optimistic rent with no vacancy allowance.",
            "Comparing cash-on-cash returns across deals with very different risk or leverage without looking at cap rate and DSCR too.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "Year-one, pre-tax figures; rent and expenses are held constant.",
    "The mortgage payment entered is principal and interest only; taxes and insurance belong in operating expenses.",
    "Loan paydown, appreciation and depreciation are not included.",
  ],
  faqs: [
    {
      question: "What is a good cash-on-cash return?",
      answer: "Many rental investors look for 8–12%, while some accept less in markets with strong appreciation. Compare it with what the same cash could earn elsewhere at similar risk.",
    },
    {
      question: "Is cash-on-cash return the same as ROI?",
      answer: "Not exactly. Cash-on-cash return measures one year's cash flow against cash invested. ROI usually measures total gain over the whole holding period, including appreciation and loan paydown when the property is sold.",
    },
    {
      question: "How does leverage affect cash-on-cash return?",
      answer: "Borrowing reduces the cash you invest. If the property's cap rate exceeds your loan's cost, leverage increases cash-on-cash return; if borrowing costs are higher than the cap rate, leverage reduces it.",
    },
  ],
};

export default content;
