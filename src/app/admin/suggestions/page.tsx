import { updateSuggestionStatus } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { getDb } from "@/lib/db";
import { features } from "@/lib/env";

export const dynamic = "force-dynamic";

const STATUSES = ["NEW", "PLANNED", "BUILT", "DECLINED"] as const;

export default async function SuggestionsPage() {
  const suggestions = features.database ? await getDb().calculatorSuggestion.findMany({ orderBy: { createdAt: "desc" }, take: 200 }) : [];
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Calculator suggestions</h1>
      {suggestions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No suggestions yet.</p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {suggestions.map((s) => (
            <li key={s.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-medium">
                  {s.title} <Badge>{s.status.toLowerCase()}</Badge>
                </p>
                {s.description && <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>}
                <p className="mt-1 text-xs text-subtle-foreground">
                  {s.createdAt.toLocaleDateString("en-US")} {s.email && `· ${s.email}`}
                </p>
              </div>
              <div className="flex gap-1">
                {STATUSES.filter((status) => status !== s.status).map((status) => (
                  <form key={status} action={updateSuggestionStatus.bind(null, s.id, status)}>
                    <button type="submit" className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
                      {status.toLowerCase()}
                    </button>
                  </form>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
