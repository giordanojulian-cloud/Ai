import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/lib/auth/session";
import { features } from "@/lib/env";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/calculators", label: "Calculators" },
  { href: "/admin/suggestions", label: "Suggestions" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <Container className="py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Admin</p>
        <nav aria-label="Admin" className="flex gap-1">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-surface-muted hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {!features.database && <Alert variant="warning" className="mb-6">DATABASE_URL is not set, so admin changes can’t be saved.</Alert>}
      {children}
    </Container>
  );
}
