"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavDropdownItem } from "./nav-dropdown";

export function MobileNav({ categories, popular }: { categories: NavDropdownItem[]; popular: NavDropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex size-9 items-center justify-center rounded-md text-foreground hover:bg-surface-muted"
      >
        {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
      </button>
      <div id="mobile-menu" hidden={!open} className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-border bg-background px-4 pt-4 pb-10">
        <nav aria-label="Mobile" className="flex flex-col gap-6">
          <Link href="/calculators" className="text-base font-semibold">
            All calculators
          </Link>
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Categories</p>
            <ul className="grid grid-cols-2 gap-1">
              {categories.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="block rounded-md py-2 text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Popular</p>
            <ul className="flex flex-col gap-1">
              {popular.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="block rounded-md py-2 text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
            <Link href="/pricing">Pricing</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/signin" className="font-medium text-primary">
              Sign in
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
