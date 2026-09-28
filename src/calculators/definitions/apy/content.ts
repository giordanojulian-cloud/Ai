import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "APY (annual percentage yield) is the rate you actually earn in a year once compounding is included. Because interest earns interest, APY is always equal to or higher than the stated rate, and the gap grows with more frequent compounding and higher rates.",
    "Banks in the U.S. are required to disclose APY on deposit accounts, which makes it the right number for comparing savings accounts and CDs. If two accounts quote different compounding schedules, compare their APYs, not their stated rates.",
  ],
  howItWorks: [
    "The stated rate is divided by the number of compounding periods per year, compounded for that many periods, and converted back to an annual percentage. Continuous compounding uses the exponential function instead.",
    "To go from APY back to a stated rate, the calculator reverses the formula for the compounding frequency you select.",
  ],
  formulas: [
    {
      label: "APY from a stated rate",
      expression: "APY = (1 + r ÷ n)^n − 1",
      variables: [
        { symbol: "r", meaning: "stated annual rate (decimal)" },
        { symbol: "n", meaning: "compounding periods per year" },
      ],
    },
    { label: "Continuous compounding", expression: "APY = e^r − 1" },
    { label: "Stated rate from APY", expression: "r = n × ((1 + APY)^(1/n) − 1)" },
  ],
  example: {
    title: "Example: 4.5% compounded daily",
    body: [
      {
        steps: [
          "Daily rate = 4.5% ÷ 365 ≈ 0.01233%.",
          "APY = (1 + 0.045/365)^365 − 1 ≈ 4.602%.",
          "With monthly compounding instead, the APY is about 4.594% — a difference of less than a hundredth of a percentage point.",
          "On a $10,000 deposit, daily compounding earns about $460.25 in a year.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "APY vs. APR",
      body: [
        "APY is used for money you earn (savings, CDs). APR is used for money you owe (loans, credit cards) and generally does not include compounding. A credit card with a 24% APR that compounds daily effectively costs about 27.1% per year if you carry a balance.",
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Comparing a stated rate with an APY — always compare like with like.",
            "Assuming a promotional APY lasts. Many high-yield rates are variable and can change at any time.",
            "Overvaluing compounding frequency. At normal savings rates, the rate itself matters far more than daily versus monthly compounding.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "The rate is fixed for the full year and interest is left in the account.",
    "Daily compounding uses 365 periods per year.",
    "Taxes and fees are not included.",
  ],
  faqs: [
    {
      question: "Is a higher APY always better?",
      answer:
        "For comparable accounts, yes — APY already accounts for compounding. But also check minimum balances, fees, withdrawal limits and whether the rate is promotional or variable.",
    },
    {
      question: "Why is APY higher than the interest rate?",
      answer: "Because interest earned during the year starts earning interest too. The more often interest compounds, the larger that effect.",
    },
    {
      question: "What does 'compounded daily, paid monthly' mean?",
      answer: "Interest is calculated each day on your balance but credited to your account once a month. The APY reflects the daily compounding.",
    },
  ],
};

export default content;
