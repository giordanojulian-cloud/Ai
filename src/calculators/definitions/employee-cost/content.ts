import type { CalculatorContent } from "../../types";
import { PAYROLL_RULES } from "./payroll-rules";

const content: CalculatorContent = {
  whatItMeans: [
    "The total annual cost is what the business spends to employ this person for a year: salary plus employer-paid taxes, benefits and the equipment and overhead that come with a seat. It's typically 1.2 to 1.4 times the base salary, and higher with generous benefits.",
    "Cost per productive hour spreads that total over the hours actually worked, after paid time off. It's the number to use when pricing billable work or comparing an employee with a contractor.",
  ],
  howItWorks: [
    `Federal employer taxes use ${PAYROLL_RULES.taxYear} parameters: Social Security at ${PAYROLL_RULES.socialSecurityRate}% of wages up to $${PAYROLL_RULES.socialSecurityWageBase.toLocaleString("en-US")}, Medicare at ${PAYROLL_RULES.medicareRate}% of all wages, and FUTA at ${PAYROLL_RULES.futaRate}% of the first $${PAYROLL_RULES.futaWageBase.toLocaleString("en-US")}. State unemployment uses the rate and wage base you enter, because both vary by state and employer history.`,
    "Benefits and overhead are added as you enter them. Workers' compensation is a percentage of payroll. Productive hours are paid hours minus paid days off (valued at the average paid hours per workday).",
  ],
  formulas: [
    { label: "Social Security (employer)", expression: `min(Salary, ${PAYROLL_RULES.socialSecurityWageBase.toLocaleString("en-US")}) × ${PAYROLL_RULES.socialSecurityRate}%` },
    { label: "Medicare (employer)", expression: `Salary × ${PAYROLL_RULES.medicareRate}%` },
    { label: "Unemployment", expression: `FUTA = min(Salary, ${PAYROLL_RULES.futaWageBase.toLocaleString("en-US")}) × ${PAYROLL_RULES.futaRate}% · SUTA = min(Salary, state base) × state rate` },
    { label: "Total cost", expression: "Total = Salary + Payroll taxes + Benefits + Workers' comp + Overhead" },
    { label: "Cost per productive hour", expression: "Total ÷ (Paid hours − Paid days off × Paid hours ÷ 260)" },
  ],
  example: {
    title: "Example: $75,000 salary",
    body: [
      {
        steps: [
          "Social Security $4,650, Medicare $1,087.50, FUTA $42 and SUTA $189 (2.7% of $7,000).",
          "Benefits: $7,500 health insurance, a 4% retirement match of $3,000 and $1,000 of other benefits.",
          "Workers' comp at 0.5% is $375, plus $3,000 of equipment and overhead.",
          "Total cost is $95,843.50 — about 1.28× salary. Over 1,920 productive hours (2,080 less 20 days off), that's about $49.92 per hour worked.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Who this calculator is for",
      body: ["Founders budgeting for a first hire, managers building headcount plans, and agencies setting billable rates."],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Budgeting salary only. Taxes and benefits commonly add 20–40%.",
            "Forgetting recruiting and onboarding costs, which aren't recurring but can be significant in year one.",
            "Comparing employee and contractor rates on salary alone. Contractors pay their own taxes and benefits, so their hourly rates should be higher.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    `Federal payroll tax rates and wage bases for ${PAYROLL_RULES.taxYear}. FUTA assumes the full state credit (no credit-reduction state).`,
    "State unemployment, workers' compensation and benefit costs are your estimates; they vary by state, industry and plan.",
    "Salary is paid evenly through the year. Bonuses, overtime and equity are not included.",
    "Productive hours assume paid days off are valued at the average paid hours per workday (paid hours ÷ 260).",
  ],
  faqs: [
    {
      question: "How much does an employee cost on top of salary?",
      answer: "A common rule of thumb is 1.25 to 1.4 times salary once payroll taxes, benefits and overhead are included. The calculator itemizes the actual figures for your inputs.",
    },
    {
      question: "Do employers pay the additional 0.9% Medicare tax?",
      answer: "No. The additional Medicare tax on wages above $200,000 is paid by the employee only, though employers must withhold it.",
    },
    {
      question: "What is SUTA?",
      answer: "State unemployment tax. Each state sets its own wage base and assigns employers a rate based on industry and claims history; new employers usually receive a standard starting rate.",
    },
  ],
  sources: PAYROLL_RULES.sources.map((s) => ({ ...s })),
};

export default content;
