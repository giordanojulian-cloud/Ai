import Link from "next/link";
import { calculatorMetas } from "@/calculators/registry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDb } from "@/lib/db";
import { features } from "@/lib/env";
import { getFullCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

async function stats() {
  if (!features.database) return null;
  const db = getDb();
  const [users, saved, subscribers, suggestions, helpful, notHelpful, recentFeedback] = await Promise.all([
    db.user.count(),
    db.savedCalculation.count(),
    db.newsletterSubscriber.count({ where: { unsubscribedAt: null } }),
    db.calculatorSuggestion.count({ where: { status: "NEW" } }),
    db.feedback.count({ where: { helpful: true } }),
    db.feedback.count({ where: { helpful: false } }),
    db.feedback.findMany({ where: { comment: { not: null } }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);
  return { users, saved, subscribers, suggestions, helpful, notHelpful, recentFeedback };
}

export default async function AdminOverview() {
  const [catalog, s] = await Promise.all([getFullCatalog(), stats()]);
  const published = catalog.filter((c) => (c.status ?? "published") === "published").length;
  const tiles = [
    { label: "Calculators", value: `${published} / ${calculatorMetas.length} published` },
    ...(s
      ? [
          { label: "Users", value: s.users },
          { label: "Saved calculations", value: s.saved },
          { label: "Newsletter subscribers", value: s.subscribers },
          { label: "New suggestions", value: s.suggestions },
          { label: "Helpful rating", value: s.helpful + s.notHelpful ? `${Math.round((s.helpful / (s.helpful + s.notHelpful)) * 100)}% of ${s.helpful + s.notHelpful}` : "—" },
        ]
      : []),
  ];
  return (
    <div className="flex flex-col gap-8">
      <ul className="grid gap-3 sm:grid-cols-3">
        {tiles.map((t) => (
          <li key={t.label} className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs text-muted-foreground">{t.label}</p>
            <p className="mt-1 text-xl font-semibold">{t.value}</p>
          </li>
        ))}
      </ul>
      {s && (
        <Card>
          <CardHeader>
            <CardTitle>Recent feedback comments</CardTitle>
          </CardHeader>
          <CardContent>
            {s.recentFeedback.length ? (
              <ul className="divide-y divide-border text-sm">
                {s.recentFeedback.map((f) => (
                  <li key={f.id} className="py-2">
                    <Link href={`/calculator/${f.calculatorSlug}`} className="font-medium hover:text-primary">
                      {f.calculatorSlug}
                    </Link>{" "}
                    <span className="text-muted-foreground">— {f.comment}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
