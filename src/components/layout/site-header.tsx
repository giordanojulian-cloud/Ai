import Link from "next/link";
import { categories } from "@/calculators/categories";
import { sortByPopularity } from "@/calculators/registry";
import { Container } from "@/components/ui/container";
import { SearchDialog } from "@/components/search/search-dialog";
import { getCatalog } from "@/lib/catalog";
import { AccountLink } from "./account-link";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { NavDropdown } from "./nav-dropdown";
import { ThemeToggle } from "./theme";

export async function SiteHeader() {
  const catalog = await getCatalog();
  const categoryItems = categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name, description: c.shortDescription }));
  const popularItems = sortByPopularity(catalog)
    .slice(0, 6)
    .map((c) => ({ href: `/calculator/${c.slug}`, label: c.name }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:shadow">
        Skip to content
      </a>
      <Container className="flex h-16 items-center gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          <Link href="/calculators" className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground">
            Calculators
          </Link>
          <NavDropdown label="Categories" items={categoryItems} footer={{ href: "/calculators", label: "Browse all calculators →" }} />
          <NavDropdown label="Popular" items={popularItems} />
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <SearchDialog />
          <ThemeToggle />
          <AccountLink />
        </div>
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <SearchDialog variant="icon" />
          <ThemeToggle />
          <MobileNav categories={categoryItems} popular={popularItems} />
        </div>
      </Container>
    </header>
  );
}
