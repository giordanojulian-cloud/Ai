"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface NavDropdownItem {
  href: string;
  label: string;
  description?: string;
}

/** Disclosure-style menu: click/Enter to open, Escape or outside click to close. */
export function NavDropdown({ label, items, footer }: { label: string; items: NavDropdownItem[]; footer?: NavDropdownItem }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu on navigation
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground aria-expanded:text-foreground"
      >
        {label}
        <ChevronDown aria-hidden className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      <div id={id} hidden={!open} className="absolute top-full left-0 z-50 mt-2 w-80 rounded-xl border border-border bg-surface p-2 shadow-lg">
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block rounded-lg px-3 py-2 hover:bg-surface-muted">
                <span className="block text-sm font-medium">{item.label}</span>
                {item.description && <span className="block text-xs text-muted-foreground">{item.description}</span>}
              </Link>
            </li>
          ))}
        </ul>
        {footer && (
          <Link href={footer.href} className="mt-1 block rounded-lg border-t border-border px-3 pt-3 pb-2 text-sm font-medium text-primary hover:underline">
            {footer.label}
          </Link>
        )}
      </div>
    </div>
  );
}
