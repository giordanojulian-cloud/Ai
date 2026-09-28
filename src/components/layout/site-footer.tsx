import Link from "next/link";
import { categories } from "@/calculators/categories";
import { sortByPopularity } from "@/calculators/registry";
import { NewsletterForm } from "@/components/feedback/newsletter-form";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { getCatalog } from "@/lib/catalog";
import { Logo } from "./logo";

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function SiteFooter() {
  const catalog = await getCatalog();
  const popular = sortByPopularity(catalog).slice(0, 6);
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="max-w-sm text-sm text-muted-foreground">{siteConfig.description}</p>
            <NewsletterForm location="footer" />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <FooterColumn title="Categories" links={categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name }))} />
            <FooterColumn title="Popular tools" links={popular.map((c) => ({ href: `/calculator/${c.slug}`, label: c.shortName ?? c.name }))} />
            <FooterColumn
              title="Company"
              links={[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/pricing", label: "Pricing" },
                { href: "/calculators", label: "All calculators" },
              ]}
            />
            <FooterColumn
              title="Legal"
              links={[
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
                { href: "/terms#affiliate-disclosure", label: "Advertiser disclosure" },
              ]}
            />
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs leading-relaxed text-subtle-foreground">
          <p>
            {siteConfig.name} calculators provide estimates for educational purposes. Results depend on the inputs and assumptions you
            provide, and actual results can differ. We do not provide financial, tax, legal, lending or investment advice.
          </p>
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
