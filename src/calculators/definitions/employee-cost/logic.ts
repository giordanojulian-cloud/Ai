import { PAYROLL_RULES } from "./payroll-rules";

export interface EmployeeCostInput {
  salary: number;
  healthInsuranceAnnual: number;
  retirementMatchPercent: number;
  otherBenefitsAnnual: number;
  workersCompPercent: number;
  sutaRatePercent: number;
  sutaWageBase: number;
  overheadAnnual: number;
  paidHoursPerYear: number;
  paidDaysOff: number;
}

export interface CostLine {
  group: "Payroll taxes" | "Benefits" | "Other";
  label: string;
  amount: number;
}

export interface EmployeeCostResult {
  lines: CostLine[];
  addOns: number;
  totalCost: number;
  multiplier: number;
  monthlyCost: number;
  productiveHours: number;
  costPerProductiveHour: number;
}

export function calculateEmployeeCost(i: EmployeeCostInput): EmployeeCostResult {
  const r = PAYROLL_RULES;
  const lines: CostLine[] = [
    { group: "Payroll taxes", label: "Social Security (employer)", amount: (Math.min(i.salary, r.socialSecurityWageBase) * r.socialSecurityRate) / 100 },
    { group: "Payroll taxes", label: "Medicare (employer)", amount: (i.salary * r.medicareRate) / 100 },
    { group: "Payroll taxes", label: "Federal unemployment (FUTA)", amount: (Math.min(i.salary, r.futaWageBase) * r.futaRate) / 100 },
    { group: "Payroll taxes", label: "State unemployment (SUTA)", amount: (Math.min(i.salary, i.sutaWageBase) * i.sutaRatePercent) / 100 },
    { group: "Benefits", label: "Health insurance", amount: i.healthInsuranceAnnual },
    { group: "Benefits", label: "Retirement match", amount: (i.salary * i.retirementMatchPercent) / 100 },
    { group: "Benefits", label: "Other benefits", amount: i.otherBenefitsAnnual },
    { group: "Other", label: "Workers' compensation", amount: (i.salary * i.workersCompPercent) / 100 },
    { group: "Other", label: "Equipment, software & overhead", amount: i.overheadAnnual },
  ];
  const addOns = lines.reduce((sum, line) => sum + line.amount, 0);
  const totalCost = i.salary + addOns;
  const hoursPerDay = i.paidHoursPerYear / 260;
  const productiveHours = Math.max(0, i.paidHoursPerYear - i.paidDaysOff * hoursPerDay);
  return {
    lines,
    addOns,
    totalCost,
    multiplier: i.salary > 0 ? totalCost / i.salary : 0,
    monthlyCost: totalCost / 12,
    productiveHours,
    costPerProductiveHour: productiveHours > 0 ? totalCost / productiveHours : 0,
  };
}
