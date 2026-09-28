import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "The payoff time is how many monthly payments it takes to bring the balance to zero, assuming you stop using the card. Total interest is what the balance costs you in the meantime. On typical credit card rates, interest can add a large share of the original balance, especially at low payments.",
    "In target-date mode, the required payment is the fixed monthly amount that clears the balance exactly on schedule. Paying more than that finishes early and saves interest.",
  ],
  howItWorks: [
    "Each month, the calculator charges interest on the remaining balance at the APR divided by 12, then applies your payment: first to that interest, and the rest to the balance. It repeats until the balance reaches zero.",
    "To find the payment for a target date, it uses the standard loan payment formula, which gives the fixed payment that amortizes a balance over a set number of months. For comparison, it also models a common minimum-payment formula — the month's interest plus 1% of the balance, with a $25 floor.",
  ],
  formulas: [
    { label: "Monthly interest", expression: "Interest = Balance × APR ÷ 12" },
    {
      label: "Payment to pay off in n months",
      expression: "P = B × r(1 + r)^n ÷ ((1 + r)^n − 1)",
      variables: [
        { symbol: "B", meaning: "current balance" },
        { symbol: "r", meaning: "monthly rate (APR ÷ 12)" },
        { symbol: "n", meaning: "number of months" },
      ],
    },
    { label: "Months to pay off with payment P", expression: "n = −ln(1 − B × r ÷ P) ÷ ln(1 + r)" },
  ],
  example: {
    title: "Example: $8,000 at 24% APR",
    body: [
      {
        steps: [
          "The monthly rate is 24% ÷ 12 = 2%, so the first month's interest is $160.",
          "With a $300 payment, $140 goes to the balance in month one. Because interest falls as the balance falls, more of each payment goes to principal over time.",
          "The balance is gone after 39 payments, with about $3,547 of total interest.",
          "To pay it off in 24 months instead, you'd need about $423 a month — and would pay roughly $2,150 in interest.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Who this calculator is for",
      body: [
        "Anyone carrying a credit card balance from month to month, people deciding whether a balance transfer or consolidation loan is worth it, and anyone who wants a concrete payoff date to aim for.",
      ],
    },
    {
      heading: "Why minimum payments take so long",
      body: [
        "Minimum payments are designed to shrink as your balance shrinks, so the amount going to principal stays small. With a minimum of interest plus 1% of the balance, a large share of every payment is interest, and payoff can stretch over many years. Committing to a fixed payment — even one only slightly above the current minimum — cuts the timeline dramatically.",
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Continuing to use the card while paying it off. New purchases extend the payoff date.",
            "Ignoring the penalty APR. A late payment can raise your rate, which changes the math.",
            "Treating a 0% balance transfer as free. Transfer fees are often 3–5%, and the rate typically jumps when the promotion ends.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "No new purchases, fees or rate changes.",
    "Interest is charged monthly at APR ÷ 12; card issuers usually compute interest on the average daily balance, which gives slightly different results.",
    "Payments are made on time each month.",
    "The minimum-payment comparison uses interest + 1% of the balance with a $25 floor. Issuers' formulas vary, so check your statement.",
  ],
  faqs: [
    {
      question: "How is credit card interest calculated?",
      answer:
        "Most issuers divide the APR by 365 to get a daily rate and apply it to your average daily balance over the billing cycle. This calculator uses the simpler monthly approximation, which is very close for planning purposes.",
    },
    {
      question: "How can I pay off my credit card faster?",
      answer:
        "Pay a fixed amount above the minimum every month, stop adding new charges, and put windfalls toward the balance. Lowering the rate — through a balance transfer, a consolidation loan or asking your issuer — also helps.",
    },
    {
      question: "What happens if I only pay the minimum?",
      answer:
        "You'll pay far more interest and take much longer to finish, because the minimum shrinks as the balance falls. Your statement is required to show how long minimum payments would take.",
    },
    {
      question: "Is it better to pay off one card at a time?",
      answer:
        "If you have several cards, pay the minimum on all of them and put any extra toward one target card. Use the debt payoff calculator to compare the avalanche and snowball methods.",
    },
  ],
  sources: [
    { label: "CFPB: How is my credit card interest calculated?", url: "https://www.consumerfinance.gov/ask-cfpb/how-does-my-credit-card-company-calculate-the-amount-of-interest-i-owe-en-51/" },
  ],
};

export default content;
