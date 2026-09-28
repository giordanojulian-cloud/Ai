import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "The hourly rate is your salary spread over the hours you actually work in a year. It's the fairest way to compare a salaried role with an hourly one, or two salaried roles with very different hours.",
    "Pay-period amounts show what each paycheck would be before taxes and deductions. Biweekly and semimonthly are different: biweekly pay arrives 26 times a year, semimonthly 24 times, so biweekly checks are slightly smaller.",
  ],
  howItWorks: [
    "Annual hours are hours per week multiplied by weeks worked per year. The hourly rate is the annual salary divided by those hours (or, in reverse, the hourly rate multiplied by them).",
    "Pay-period amounts divide the annual figure by the number of periods in a calendar year, because salaries are paid evenly across the year even when you take time off. Daily pay is one week's worked pay divided by the days you work each week.",
  ],
  formulas: [
    { label: "Hourly rate", expression: "Hourly = Annual salary ÷ (Hours per week × Weeks worked per year)" },
    { label: "Annual salary", expression: "Annual = Hourly × Hours per week × Weeks worked per year" },
    { label: "Pay periods", expression: "Monthly = Annual ÷ 12 · Semimonthly = Annual ÷ 24 · Biweekly = Annual ÷ 26 · Weekly = Annual ÷ 52" },
  ],
  example: {
    title: "Example: $65,000 salary, 40 hours a week",
    body: [
      {
        steps: [
          "Annual hours = 40 × 52 = 2,080.",
          "Hourly rate = $65,000 ÷ 2,080 = $31.25.",
          "Monthly pay = $65,000 ÷ 12 ≈ $5,416.67; biweekly = $65,000 ÷ 26 = $2,500.",
          "Daily pay = $31.25 × 40 ÷ 5 = $250.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Who this calculator is for",
      body: ["Job seekers comparing offers, contractors pricing their time, and employees switching between hourly and salaried roles."],
    },
    {
      heading: "Comparing salaried and hourly jobs fairly",
      body: [
        {
          list: [
            "Use your realistic hours. A $90,000 role that requires 55 hours a week pays less per hour than a $75,000 role at 40 hours.",
            "Account for overtime. Hourly roles may pay 1.5× for hours above 40 per week; most salaried roles don't.",
            "Include benefits. Health insurance, retirement matching and paid time off can be worth tens of thousands of dollars a year.",
          ],
        },
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Subtracting paid vacation from weeks worked. If time off is paid, keep 52 weeks — you're paid for those weeks.",
            "Confusing biweekly with semimonthly pay when budgeting monthly expenses.",
            "Comparing contract hourly rates to employee wages directly. Contractors pay both halves of payroll taxes and cover their own benefits.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "All figures are gross pay before taxes and deductions.",
    "Hours are the same every week; overtime premiums are not modeled.",
    "Pay periods divide the annual amount evenly (52 weeks, 26 biweekly, 24 semimonthly, 12 monthly periods).",
  ],
  faqs: [
    {
      question: "How many working hours are in a year?",
      answer: "A standard full-time schedule of 40 hours a week for 52 weeks is 2,080 hours. That's the figure most employers use to convert salaries to hourly rates.",
    },
    {
      question: "What is $50,000 a year per hour?",
      answer: "At 40 hours a week for 52 weeks, $50,000 a year is about $24.04 per hour. Change the hours or weeks to match your schedule.",
    },
    {
      question: "Is biweekly the same as twice a month?",
      answer: "No. Biweekly means every two weeks — 26 paychecks a year, with two months that have three paychecks. Twice a month (semimonthly) means 24 paychecks a year.",
    },
    {
      question: "How do I estimate take-home pay?",
      answer: "Subtract federal and state income taxes, Social Security and Medicare, and any pre-tax deductions such as retirement contributions and health premiums. The amounts here are before those deductions.",
    },
  ],
};

export default content;
