/**
 * Calculator categories. Order here is the display order across the site.
 * Each category carries its own intro copy so category pages are not thin.
 */
export const categories = [
  {
    slug: "finance",
    name: "Finance",
    title: "Personal Finance Calculators",
    shortDescription: "Budgeting, savings, interest and everyday money math.",
    description:
      "Personal finance calculators for saving, earning interest, comparing rates and understanding what your paycheck is really worth.",
    intro: [
      "Small differences in interest rates, savings rates and pay compound into large differences over time. These calculators make those numbers concrete so you can compare options side by side instead of guessing.",
      "Every calculator shows the formula it uses and the assumptions behind it, so you can check the math and adapt it to your own situation.",
    ],
    icon: "wallet",
  },
  {
    slug: "investing",
    name: "Investing",
    title: "Investing Calculators",
    shortDescription: "Growth, compounding and return on investment.",
    description:
      "Investing calculators that project growth, measure returns and show the effect of compounding, contributions and inflation.",
    intro: [
      "Investment outcomes are driven by a handful of variables: how much you invest, how long you stay invested, the return you earn and the costs you pay. These tools isolate each one so you can see which matters most.",
      "Projections use constant rates of return for clarity. Real markets are volatile, so treat the results as a way to compare scenarios rather than as forecasts.",
    ],
    icon: "trending-up",
  },
  {
    slug: "debt",
    name: "Debt",
    title: "Debt Payoff Calculators",
    shortDescription: "Payoff timelines, interest costs and payoff strategies.",
    description:
      "Debt calculators that show how long payoff will take, how much interest you will pay and how extra payments change the timeline.",
    intro: [
      "The cost of debt is mostly determined by its interest rate and how quickly you pay it down. These calculators show month-by-month payoff schedules so the trade-off between payment size and total interest is visible.",
      "Compare strategies such as the avalanche and snowball methods, or see how much a fixed extra payment shortens your payoff date.",
    ],
    icon: "credit-card",
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    title: "Real Estate & Mortgage Calculators",
    shortDescription: "Mortgages, affordability and rental property analysis.",
    description:
      "Mortgage and real estate calculators for estimating payments, affordability, closing costs and rental property returns.",
    intro: [
      "Buying or investing in property involves more than a loan payment. Property taxes, insurance, mortgage insurance, HOA dues, vacancy and maintenance all change what a property really costs and earns.",
      "These calculators include those line items explicitly and show full amortization schedules, so you can see where every dollar goes over the life of the loan.",
    ],
    icon: "home",
  },
  {
    slug: "business",
    name: "Business",
    title: "Business Calculators",
    shortDescription: "Margins, pricing, break-even and valuation.",
    description:
      "Business calculators for pricing, margins, break-even analysis, employee costs and SaaS valuation estimates.",
    intro: [
      "Good pricing and hiring decisions start with accurate unit economics. These calculators cover the core formulas every operator uses: margin, markup, contribution margin, fully loaded employee cost and revenue multiples.",
      "Each tool explains the difference between commonly confused metrics — such as margin versus markup — so the numbers you share with your team mean the same thing to everyone.",
    ],
    icon: "briefcase",
  },
  {
    slug: "construction",
    name: "Construction",
    title: "Construction & Home Project Calculators",
    shortDescription: "Materials, quantities and project estimates.",
    description:
      "Construction calculators for estimating concrete, flooring and other material quantities before you buy.",
    intro: [
      "Ordering the right amount of material saves money and avoids delays. These calculators convert measurements into the units suppliers actually sell, with a waste allowance built in.",
      "Always confirm quantities with your supplier or contractor, especially for structural work.",
    ],
    icon: "hard-hat",
  },
  {
    slug: "career",
    name: "Career",
    title: "Career & Salary Calculators",
    shortDescription: "Pay conversions and compensation comparisons.",
    description: "Career calculators for converting salaries to hourly rates and comparing compensation.",
    intro: [
      "Job offers are quoted in different ways — annual salary, hourly rate, day rate. Converting them to the same basis is the first step in comparing offers fairly.",
    ],
    icon: "clock",
  },
  {
    slug: "everyday",
    name: "Everyday",
    title: "Everyday Calculators",
    shortDescription: "Quick math for percentages, tips and daily decisions.",
    description: "Everyday calculators for percentages, tips and the quick math that comes up daily.",
    intro: [
      "Quick, dependable answers for the math that comes up every day, with the working shown so you can do it yourself next time.",
    ],
    icon: "calculator",
  },
] as const satisfies readonly {
  slug: string;
  name: string;
  title: string;
  shortDescription: string;
  description: string;
  intro: readonly string[];
  icon: string;
}[];

export type Category = (typeof categories)[number];
export type CategorySlug = Category["slug"];

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return categories.some((category) => category.slug === slug);
}
