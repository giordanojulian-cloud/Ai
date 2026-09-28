import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "Total area is the floor space you're covering. The figure with waste is how much material to buy, because cuts, pattern matching and mistakes always consume extra.",
  ],
  howItWorks: [
    "Each rectangular area's square footage is its length times its width. The calculator adds up every area you enter, then applies the waste percentage. Square meters use the exact conversion of 0.09290304 m² per square foot; square yards divide by 9.",
    "For L-shaped or irregular rooms, split the space into rectangles and enter each one as a separate area.",
  ],
  formulas: [
    { label: "Area of a rectangle", expression: "Area = Length × Width" },
    { label: "Material to order", expression: "Order = Σ areas × (1 + waste)" },
    { label: "Conversions", expression: "m² = ft² × 0.09290304 · yd² = ft² ÷ 9" },
  ],
  example: {
    title: "Example: two rooms",
    body: [
      {
        steps: [
          "Room 1: 12 × 14 ft = 168 sq ft. Room 2: 10 × 12 ft = 120 sq ft.",
          "Total area: 288 sq ft (about 26.76 m²).",
          "With 10% waste, order 316.8 sq ft — round up to 317. At $4.50 per sq ft, materials cost about $1,426.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "How much waste to allow",
      body: [
        {
          list: [
            "Straight-lay flooring in simple rooms: 5–10%.",
            "Diagonal or herringbone patterns: 15% or more.",
            "Tile with large formats or many cuts: 10–15%, plus a few spares for future repairs.",
          ],
        },
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Measuring to the nearest foot instead of the nearest inch on large rooms.",
            "Forgetting closets, alcoves and doorways.",
            "Not checking the box coverage — flooring is sold by the box, so round up to whole boxes.",
          ],
        },
      ],
    },
  ],
  assumptions: ["All areas are rectangles measured in feet.", "The waste percentage is applied to the combined area."],
  faqs: [
    {
      question: "How do I calculate square footage of an L-shaped room?",
      answer: "Divide the room into two rectangles, measure each, and enter them as separate areas. The calculator adds them together.",
    },
    {
      question: "How many square feet is a 12 × 12 room?",
      answer: "144 square feet (12 × 12).",
    },
    {
      question: "Does square footage include walls?",
      answer: "No. This calculates floor area. For paint or wallpaper, measure each wall's width and height as separate areas and subtract windows and doors.",
    },
  ],
};

export default content;
