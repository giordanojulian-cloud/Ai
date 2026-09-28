import type { DisclaimerKind } from "@/calculators/types";

const copy: Record<Exclude<DisclaimerKind, "none">, string> = {
  financial:
    "Results are estimates based on the information you enter and the assumptions described on this page. Actual costs, rates and outcomes can differ. This calculator is for educational purposes and does not provide financial, tax, legal, lending or investment advice.",
  estimate:
    "Results are estimates based on the information you enter. Actual quantities and costs can differ, so confirm important numbers with a qualified professional.",
};

export function CalculatorDisclaimer({ kind }: { kind: DisclaimerKind }) {
  if (kind === "none") return null;
  return <p className="text-xs leading-relaxed text-subtle-foreground">{copy[kind]}</p>;
}
