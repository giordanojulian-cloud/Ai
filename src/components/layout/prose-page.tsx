import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

export function ProsePage({ title, intro, updated, children }: { title: string; intro?: string; updated?: string; children: ReactNode }) {
  return (
    <Container className="max-w-3xl py-12">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {intro && <p className="mt-3 text-lg text-muted-foreground">{intro}</p>}
      {updated && <p className="mt-2 text-sm text-subtle-foreground">Last updated {updated}</p>}
      <div className="prose-content mt-10 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight">{children}</div>
    </Container>
  );
}
