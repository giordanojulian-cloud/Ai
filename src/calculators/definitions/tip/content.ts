import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "The result shows the tip, the total with tip, and each person's share. With rounding on, each share is rounded up to a whole dollar and the difference is added to the tip, so the server receives slightly more than your chosen percentage.",
  ],
  howItWorks: [
    "The tip is the pre-tax subtotal multiplied by the tip percentage. The total is subtotal plus tax plus tip, divided evenly between the number of people.",
  ],
  formulas: [
    { label: "Tip", expression: "Tip = Subtotal × Tip %" },
    { label: "Total", expression: "Total = Subtotal + Tax + Tip" },
    { label: "Per person", expression: "Share = Total ÷ People   (rounded up if selected)" },
  ],
  example: {
    title: "Example: $85 dinner for two",
    body: [
      {
        steps: [
          "An 18% tip on the $85 subtotal is $15.30.",
          "Adding $7.23 tax gives a total of $107.53, or $53.77 per person (rounded to the cent).",
          "Rounding up, each person pays $54 and the tip becomes $15.77.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Tipping guidelines in the U.S.",
      body: [
        {
          list: [
            "Sit-down restaurants: 15–20% is standard, with 20% or more for excellent service.",
            "Large parties: many restaurants add an automatic gratuity — check the bill before tipping again.",
            "Delivery: 15–20%, with a minimum of a few dollars for small orders.",
          ],
        },
        "Customs vary by country; in many places, service is included in the price.",
      ],
    },
  ],
  assumptions: ["The tip is calculated on the pre-tax subtotal.", "The bill is split evenly."],
  faqs: [
    { question: "Should I tip on the total with tax?", answer: "The common convention is to tip on the pre-tax amount, though some people tip on the total for simplicity. The difference is usually small." },
    { question: "How do I calculate a 20% tip quickly?", answer: "Move the decimal point one place left to get 10%, then double it. On a $60 bill, 10% is $6, so 20% is $12." },
    { question: "What does rounding up do?", answer: "It rounds each person's share up to the next whole dollar, which makes paying in cash easier and adds a little to the tip." },
  ],
};

export default content;
