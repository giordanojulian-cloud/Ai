import { formatCurrency, formatNumber } from "@/lib/format";
import { defineCalculator } from "../../types";
import { calculateEmployeeCost } from "./logic";
import { PAYROLL_RULES } from "./payroll-rules";

type Values = {
  salary: number;
  health: number;
  match: number;
  otherBenefits: number;
  workersComp: number;
  sutaRate: number;
  sutaBase: number;
  overhead: number;
  hours: number;
  daysOff: number;
};

export default defineCalculator<Values>({
  slug: "employee-cost",
  groups: [
    { id: "pay", label: "Pay" },
    { id: "benefits", label: "Benefits" },
    { id: "taxes", label: "State taxes & insurance", collapsible: true, description: `Federal payroll taxes use ${PAYROLL_RULES.taxYear} rates automatically.` },
    { id: "time", label: "Overhead & time", collapsible: true },
  ],
  fields: [
    { key: "salary", label: "Annual salary", type: "number", format: "currency", default: 75_000, min: 1, max: 100_000_000, step: 1_000, group: "pay" },
    { key: "health", label: "Employer health insurance (annual)", type: "number", format: "currency", default: 7_500, min: 0, max: 1_000_000, step: 250, group: "benefits", optional: true },
    { key: "match", label: "Retirement match", type: "number", format: "percent", default: 4, min: 0, max: 50, step: 0.5, group: "benefits", optional: true, help: "Percent of salary." },
    { key: "otherBenefits", label: "Other benefits (annual)", type: "number", format: "currency", default: 1_000, min: 0, max: 1_000_000, step: 100, group: "benefits", optional: true, help: "Life/disability insurance, stipends, training." },
    { key: "sutaRate", label: "State unemployment (SUTA) rate", type: "number", format: "percent", default: 2.7, min: 0, max: 15, step: 0.1, group: "taxes", optional: true },
    { key: "sutaBase", label: "SUTA wage base", type: "number", format: "currency", default: 7_000, min: 0, max: 200_000, step: 500, group: "taxes", optional: true, help: "Varies by state." },
    { key: "workersComp", label: "Workers' comp rate", type: "number", format: "percent", default: 0.5, min: 0, max: 30, step: 0.1, group: "taxes", optional: true, help: "Percent of payroll; depends on job classification." },
    { key: "overhead", label: "Equipment, software & overhead (annual)", type: "number", format: "currency", default: 3_000, min: 0, max: 1_000_000, step: 250, group: "time", optional: true },
    { key: "hours", label: "Paid hours per year", type: "number", format: "integer", default: 2_080, min: 1, max: 4_000, step: 40, group: "time" },
    { key: "daysOff", label: "Paid days off (PTO + holidays)", type: "number", format: "integer", default: 20, min: 0, max: 100, step: 1, group: "time", optional: true },
  ],
  compute: (v) => {
    const r = calculateEmployeeCost({
      salary: v.salary,
      healthInsuranceAnnual: v.health,
      retirementMatchPercent: v.match,
      otherBenefitsAnnual: v.otherBenefits,
      workersCompPercent: v.workersComp,
      sutaRatePercent: v.sutaRate,
      sutaWageBase: v.sutaBase,
      overheadAnnual: v.overhead,
      paidHoursPerYear: v.hours,
      paidDaysOff: v.daysOff,
    });
    const groups = (["Payroll taxes", "Benefits", "Other"] as const).map((group) => ({
      group,
      total: r.lines.filter((l) => l.group === group).reduce((s, l) => s + l.amount, 0),
    }));
    return {
      primary: { label: "Total annual cost", value: r.totalCost, format: "currency", hint: `${formatNumber(r.multiplier, 2)}× the base salary` },
      secondary: [
        { label: "Cost beyond salary", value: r.addOns, format: "currency" },
        { label: "Monthly cost", value: r.monthlyCost, format: "currency" },
        { label: "Cost per productive hour", value: r.costPerProductiveHour, format: "currency", hint: `${formatNumber(r.productiveHours, 0)} hours worked` },
        ...groups.map((g) => ({ label: g.group, value: g.total, format: "currency" as const })),
      ],
      charts: [
        {
          id: "breakdown",
          title: "Total cost breakdown",
          kind: "donut",
          xKey: "label",
          series: [{ key: "value", label: "Annual" }],
          data: [{ label: "Salary", value: v.salary }, ...groups.map((g) => ({ label: g.group, value: g.total }))].filter((d) => d.value > 0),
          valueFormat: "currency",
        },
      ],
      tables: [
        {
          id: "lines",
          title: "Itemized employer costs",
          views: [
            {
              id: "all",
              label: "All items",
              columns: [
                { key: "group", label: "Category", align: "left" },
                { key: "label", label: "Item", align: "left" },
                { key: "amount", label: "Annual", format: "currency" },
                { key: "monthly", label: "Monthly", format: "currency" },
              ],
              rows: [
                { group: "Pay", label: "Base salary", amount: v.salary, monthly: v.salary / 12 },
                ...r.lines.filter((l) => l.amount > 0).map((l) => ({ ...l, monthly: l.amount / 12 })),
              ],
              footer: { group: "Total", label: "", amount: r.totalCost, monthly: r.monthlyCost },
            },
          ],
        },
      ],
      insights: [
        `Beyond the ${formatCurrency(v.salary, 0)} salary, this hire costs about ${formatCurrency(r.addOns, 0)} more per year — ${formatNumber((r.multiplier - 1) * 100, 0)}% on top of pay.`,
        `Excluding ${v.daysOff} paid days off, each hour actually worked costs about ${formatCurrency(r.costPerProductiveHour)}. Use this when pricing the employee's time to clients.`,
      ],
    };
  },
});
