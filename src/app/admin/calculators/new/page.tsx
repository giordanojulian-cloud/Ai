import { categories } from "@/calculators/categories";
import { NewCalculatorForm } from "@/components/admin/new-calculator-form";

export default function NewCalculatorPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">New calculator draft</h1>
      <p className="mt-2 mb-6 max-w-2xl text-sm text-muted-foreground">
        Drafts reserve a slug and metadata for planning. Calculation logic is always implemented in code for safety and testability, so a
        draft becomes live once a developer adds its definition folder (see docs/ADDING_A_CALCULATOR.md).
      </p>
      <NewCalculatorForm categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
    </div>
  );
}
