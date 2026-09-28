import Link from "next/link";
import { getCategory } from "@/calculators/categories";
import { hasImplementation } from "@/calculators/registry";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getFullCatalog } from "@/lib/catalog";
import { getDb } from "@/lib/db";
import { features } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function AdminCalculators() {
  const catalog = await getFullCatalog();
  const drafts = features.database
    ? (await getDb().calculator.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } })).filter((row) => !hasImplementation(row.slug))
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Calculators</h1>
        <Link href="/admin/calculators/new" className={buttonVariants({ size: "sm" })}>
          New calculator draft
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="bg-surface-muted text-left text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2 font-medium">Calculator</th>
              <th scope="col" className="px-4 py-2 font-medium">Category</th>
              <th scope="col" className="px-4 py-2 font-medium">Status</th>
              <th scope="col" className="px-4 py-2 font-medium">Flags</th>
              <th scope="col" className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {catalog.map((c) => (
              <tr key={c.slug} className="border-t border-border">
                <td className="px-4 py-2">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">/{c.slug}</p>
                </td>
                <td className="px-4 py-2">{getCategory(c.category)?.name}</td>
                <td className="px-4 py-2">
                  <Badge variant={(c.status ?? "published") === "published" ? "positive" : "default"}>{c.status ?? "published"}</Badge>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    {c.featured && <Badge variant="primary">Featured</Badge>}
                    {c.premium && <Badge variant="warning">Premium</Badge>}
                  </div>
                </td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/calculators/${c.slug}`} className="text-primary hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {drafts.map((row) => (
              <tr key={row.slug} className="border-t border-border bg-warning-soft/40">
                <td className="px-4 py-2">
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-muted-foreground">/{row.slug}</p>
                </td>
                <td className="px-4 py-2">{row.category?.name ?? "—"}</td>
                <td className="px-4 py-2">
                  <Badge variant="warning">Needs implementation</Badge>
                </td>
                <td className="px-4 py-2 text-xs text-muted-foreground" colSpan={2}>
                  Add src/calculators/definitions/{row.slug}/ to implement.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
