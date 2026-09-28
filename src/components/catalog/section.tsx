import Link from "next/link";
import type { ReactNode } from "react";

export function Section({ id, title, description, href, linkLabel, children }: { id: string; title: string; description?: string; href?: string; linkLabel?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`${id}-heading`} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id={`${id}-heading`} className="text-2xl font-semibold tracking-tight">
            {title}
          </h2>
          {description && <p className="mt-1 text-muted-foreground">{description}</p>}
        </div>
        {href && (
          <Link href={href} className="text-sm font-medium text-primary hover:underline">
            {linkLabel ?? "View all"} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
