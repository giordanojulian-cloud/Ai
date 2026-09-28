/**
 * U.S. employer payroll tax parameters. Update once a year when the SSA and
 * IRS publish new figures; the calculator reads everything from here.
 */
export const PAYROLL_RULES = {
  taxYear: 2026,
  /** Employer share of Social Security (OASDI). */
  socialSecurityRate: 6.2,
  /** Social Security wage base for the tax year. */
  socialSecurityWageBase: 184_500,
  /** Employer share of Medicare (no wage cap; the 0.9% additional Medicare tax is employee-only). */
  medicareRate: 1.45,
  /** FUTA after the maximum 5.4% state credit. Credit-reduction states pay more. */
  futaRate: 0.6,
  futaWageBase: 7_000,
  sources: [
    { label: "SSA: Contribution and benefit base", url: "https://www.ssa.gov/oact/cola/cbb.html" },
    { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
  ],
} as const;
