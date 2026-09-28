"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { searchIndex } from "@/lib/search";
import { cn } from "@/lib/utils";
import { useSearchIndex } from "./use-search-index";

interface SearchComboboxProps {
  location: "navbar" | "page" | "home";
  autoFocus?: boolean;
  size?: "md" | "lg";
  placeholder?: string;
  initialQuery?: string;
  onNavigate?: () => void;
  /** Keep results inline (inside a dialog) instead of a floating dropdown. */
  inlineResults?: boolean;
}

/** Accessible combobox (ARIA 1.2 pattern) with instant fuzzy results. */
export function SearchCombobox({
  location,
  autoFocus,
  size = "md",
  placeholder = "Search calculators — try “mortgage” or “profit margin”",
  initialQuery = "",
  onNavigate,
  inlineResults,
}: SearchComboboxProps) {
  const id = useId();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(Boolean(autoFocus));
  const index = useSearchIndex(touched);

  const results = useMemo(() => (index && query.trim() ? searchIndex(index, query, 8) : []), [index, query]);
  const showList = Boolean(open || inlineResults) && query.trim().length > 0;

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Report searches once the user pauses typing.
  useEffect(() => {
    if (!query.trim() || !index) return;
    const timer = setTimeout(() => track("search_performed", { query: query.trim().slice(0, 80), results: results.length, location }), 1200);
    return () => clearTimeout(timer);
  }, [query, results.length, index, location]);

  const go = (href: string) => {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  };

  const submit = () => {
    const hit = results[active];
    if (hit && (open || inlineResults)) go(`/calculator/${hit.doc.slug}`);
    else if (query.trim()) go(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="relative w-full">
      <form
        role="search"
        action="/search"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <label htmlFor={`${id}-input`} className="sr-only">
          Search calculators
        </label>
        <Search
          aria-hidden
          className={cn("pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-subtle-foreground", size === "lg" ? "size-5" : "size-4")}
        />
        <input
          ref={inputRef}
          id={`${id}-input`}
          name="q"
          type="search"
          role="combobox"
          autoComplete="off"
          aria-expanded={showList}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          aria-activedescendant={showList && results[active] ? `${id}-option-${active}` : undefined}
          placeholder={placeholder}
          value={query}
          onFocus={() => {
            setTouched(true);
            setOpen(true);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (event.key === "Escape" && !inlineResults) {
              setOpen(false);
            }
          }}
          className={cn(
            "w-full rounded-xl border border-input bg-surface text-foreground shadow-xs placeholder:text-subtle-foreground focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring/30 [&::-webkit-search-cancel-button]:hidden",
            size === "lg" ? "h-14 pr-4 pl-11 text-base" : "h-11 pr-3 pl-10 text-base sm:text-sm",
          )}
        />
      </form>
      <div
        className={cn(
          !showList && "hidden",
          inlineResults ? "mt-3" : "absolute inset-x-0 top-full z-40 mt-2 rounded-xl border border-border bg-surface p-1.5 shadow-lg",
        )}
      >
        <ul id={`${id}-listbox`} role="listbox" aria-label="Matching calculators" className="flex flex-col">
          {results.map((hit, i) => (
            <li
              key={hit.doc.slug}
              id={`${id}-option-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(`/calculator/${hit.doc.slug}`)}
              className={cn("cursor-pointer rounded-lg px-3 py-2.5", i === active && "bg-surface-muted")}
            >
              <span className="block text-sm font-medium">{hit.doc.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {hit.doc.categoryName} · {hit.doc.shortDescription}
              </span>
            </li>
          ))}
        </ul>
        {index && results.length === 0 && (
          <p className="px-3 py-3 text-sm text-muted-foreground">
            No calculators match “{query}”.{" "}
            <a href="/contact#suggest" className="text-primary underline-offset-4 hover:underline">
              Suggest one
            </a>
          </p>
        )}
        {!index && <p className="px-3 py-3 text-sm text-muted-foreground">Loading…</p>}
      </div>
    </div>
  );
}
