"use client";

import { useEffect, useState } from "react";
import { indexDocs, type SearchDoc } from "@/lib/search";

type Index = ReturnType<typeof indexDocs>;
let cached: Promise<Index> | null = null;

/** Loads the search index once per page load, only when search is first used. */
export function loadSearchIndex(): Promise<Index> {
  cached ??= fetch("/api/search-index")
    .then((response) => (response.ok ? (response.json() as Promise<SearchDoc[]>) : []))
    .then(indexDocs)
    .catch(() => {
      cached = null;
      return [];
    });
  return cached;
}

export function useSearchIndex(enabled: boolean): Index | null {
  const [index, setIndex] = useState<Index | null>(null);
  useEffect(() => {
    if (!enabled || index) return;
    let active = true;
    void loadSearchIndex().then((loaded) => active && setIndex(loaded));
    return () => {
      active = false;
    };
  }, [enabled, index]);
  return index;
}
