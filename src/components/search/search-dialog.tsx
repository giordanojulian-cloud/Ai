"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SearchCombobox } from "./search-combobox";

/** Navbar search: a trigger plus a native <dialog> (built-in focus trap and Escape handling). */
export function SearchDialog({ variant = "bar" }: { variant?: "bar" | "icon" }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (variant !== "bar") return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [variant]);

  return (
    <>
      {variant === "bar" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-9 w-full items-center gap-2 rounded-lg border border-border bg-surface-muted/60 px-3 text-sm text-subtle-foreground transition-colors hover:border-border-strong hover:text-muted-foreground lg:w-72"
        >
          <Search className="size-4" aria-hidden />
          <span className="flex-1 text-left">Search calculators…</span>
          <kbd className="hidden rounded border border-border bg-surface px-1.5 font-sans text-[11px] text-subtle-foreground lg:inline">⌘K</kbd>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Search calculators"
          className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-muted hover:text-foreground"
        >
          <Search className="size-5" aria-hidden />
        </button>
      )}
      <dialog
        ref={dialogRef}
        aria-label="Search calculators"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
        className={cn(
          "m-0 mx-auto mt-[10vh] w-[calc(100%-2rem)] max-w-xl rounded-2xl border border-border bg-surface p-3 text-foreground shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-[2px]",
        )}
      >
        {open && <SearchCombobox location="navbar" autoFocus inlineResults onNavigate={() => setOpen(false)} placeholder="Search calculators…" />}
      </dialog>
    </>
  );
}
