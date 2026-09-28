import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "A percentage is a number expressed as a fraction of 100. Each mode answers a different question: finding part of a whole, expressing one number relative to another, measuring how much something changed, or applying a percentage increase or decrease.",
  ],
  howItWorks: ["Choose the kind of question, enter the two numbers, and the calculator applies the matching formula and shows the working so you can check it."],
  formulas: [
    { label: "X% of Y", expression: "Result = X ÷ 100 × Y" },
    { label: "X is what percent of Y", expression: "Percent = X ÷ Y × 100" },
    { label: "Percentage change", expression: "Change = (New − Original) ÷ |Original| × 100" },
    { label: "Increase or decrease by X%", expression: "Result = Y × (1 + X ÷ 100)   (use a negative X to decrease)" },
  ],
  example: {
    title: "Examples",
    body: [
      {
        list: [
          "15% of 200 = 0.15 × 200 = 30.",
          "30 is what percent of 200? 30 ÷ 200 × 100 = 15%.",
          "From 50 to 65: (65 − 50) ÷ 50 × 100 = a 30% increase.",
          "200 decreased by 15%: 200 × 0.85 = 170.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Reversing a percentage change. A 20% drop followed by a 20% rise does not return to the original: 100 → 80 → 96.",
            "Confusing percentage points with percent. A rate rising from 4% to 5% is a 1 percentage point increase, but a 25% increase.",
            "Dividing by the wrong base. Percentage change always divides by the original value.",
          ],
        },
      ],
    },
  ],
  assumptions: ["Percentage change uses the absolute value of the original number so the sign reflects the direction of change."],
  faqs: [
    { question: "How do I calculate a percentage of a number?", answer: "Divide the percentage by 100 and multiply by the number. For example, 20% of 150 is 0.2 × 150 = 30." },
    { question: "How do I calculate percentage increase?", answer: "Subtract the original value from the new value, divide by the original, and multiply by 100." },
    { question: "What's the difference between percent and percentage points?", answer: "Percentage points measure the arithmetic difference between two percentages (4% to 5% is 1 point). Percent measures the relative change (4% to 5% is a 25% increase)." },
  ],
};

export default content;
