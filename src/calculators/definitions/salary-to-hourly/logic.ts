export interface PayInput {
  mode: "salary-to-hourly" | "hourly-to-salary";
  amount: number;
  hoursPerWeek: number;
  daysPerWeek: number;
  weeksPerYear: number;
}

export interface PayEquivalents {
  annual: number;
  monthly: number; // annual ÷ 12
  semimonthly: number; // annual ÷ 24
  biweekly: number; // annual ÷ 26
  weekly: number; // annual ÷ 52
  daily: number; // weekly pay for a worked week ÷ days per week
  hourly: number;
  hoursPerYear: number;
}

/**
 * Hourly = annual ÷ (hours per week × weeks worked per year).
 * Pay-period amounts divide the annual figure by the number of periods in a
 * calendar year (26 biweekly, 24 semimonthly...) regardless of weeks worked,
 * because salaried pay is spread evenly across the year.
 */
export function payEquivalents({ mode, amount, hoursPerWeek, daysPerWeek, weeksPerYear }: PayInput): PayEquivalents {
  const hoursPerYear = hoursPerWeek * weeksPerYear;
  const annual = mode === "salary-to-hourly" ? amount : amount * hoursPerYear;
  const hourly = mode === "salary-to-hourly" ? (hoursPerYear > 0 ? amount / hoursPerYear : 0) : amount;
  return {
    annual,
    monthly: annual / 12,
    semimonthly: annual / 24,
    biweekly: annual / 26,
    weekly: annual / 52,
    daily: daysPerWeek > 0 ? (hourly * hoursPerWeek) / daysPerWeek : 0,
    hourly,
    hoursPerYear,
  };
}
