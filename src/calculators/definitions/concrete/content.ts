import type { CalculatorContent } from "../../types";

const content: CalculatorContent = {
  whatItMeans: [
    "Cubic yards is the unit ready-mix suppliers use; bag counts are for smaller jobs you mix yourself. The result includes your waste allowance, so it's an order quantity rather than the exact volume of the form.",
  ],
  howItWorks: [
    "For slabs, footings and walls, volume is length × width × thickness, with thickness converted from inches to feet. For round columns, volume is π × radius² × height. The volume is multiplied by the quantity, increased by the waste percentage, and converted to cubic yards by dividing by 27.",
    "Bag counts divide the volume by each bag's published yield — 0.60 cubic feet for an 80 lb bag, 0.45 for 60 lb and 0.30 for 40 lb — and round up to whole bags.",
  ],
  formulas: [
    { label: "Slab volume", expression: "V = Length (ft) × Width (ft) × Thickness (in) ÷ 12" },
    { label: "Column volume", expression: "V = π × (Diameter (in) ÷ 24)² × Height (ft)" },
    { label: "Order quantity", expression: "Cubic yards = V × Quantity × (1 + waste) ÷ 27" },
    { label: "Bags", expression: "Bags = ⌈Cubic feet ÷ bag yield⌉" },
  ],
  example: {
    title: "Example: 10 × 10 ft patio, 4 inches thick",
    body: [
      {
        steps: [
          "Volume = 10 × 10 × (4 ÷ 12) = 33.33 cubic feet.",
          "Adding 10% waste gives 36.67 cubic feet, or 36.67 ÷ 27 ≈ 1.36 cubic yards.",
          "In bags: 36.67 ÷ 0.60 = 61.1, so 62 bags of 80 lb, or 82 bags of 60 lb.",
        ],
      },
    ],
  },
  guide: [
    {
      heading: "Typical thicknesses",
      body: [
        {
          list: [
            "Walkways and patios: 4 inches.",
            "Driveways: 4–6 inches, thicker for heavy vehicles.",
            "Footings: sized to local code and soil conditions — check your plans.",
          ],
        },
      ],
    },
    {
      heading: "Common mistakes to avoid",
      body: [
        {
          list: [
            "Forgetting that thickness is in inches while length and width are in feet.",
            "Ordering the exact volume. Uneven subgrade and spillage almost always require extra.",
            "Ignoring short-load fees on small ready-mix orders.",
          ],
        },
      ],
    },
  ],
  assumptions: [
    "Forms are perfectly rectangular or cylindrical with uniform thickness.",
    "Bag yields are typical published values for standard concrete mix; check the bag you buy.",
    "Rebar, gravel base and form material are not included.",
  ],
  faqs: [
    {
      question: "How many 80 lb bags make a cubic yard?",
      answer: "About 45. A cubic yard is 27 cubic feet, and an 80 lb bag yields about 0.6 cubic feet (27 ÷ 0.6 = 45).",
    },
    {
      question: "Should I use bags or ready-mix?",
      answer: "For pours under roughly one cubic yard, bags are usually more practical. Larger pours are faster, more consistent and often cheaper with ready-mix delivery.",
    },
    {
      question: "How much extra concrete should I order?",
      answer: "Most contractors add 5–10%. Use more for irregular excavations or uneven ground.",
    },
  ],
};

export default content;
