"use client";

import { useEffect, useRef } from "react";
import { adsConfig, type AdPlacement } from "@/config/monetization";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Reusable ad placement. Reserves its height to avoid layout shift. Renders
 * nothing unless ads are enabled. Premium users should never see ads — pass
 * `hidden` once entitlements are known.
 */
export function AdSlot({ placement, className, hidden }: { placement: AdPlacement; className?: string; hidden?: boolean }) {
  const pushed = useRef(false);
  const slot = adsConfig.adsenseSlots[placement];
  const enabled = !hidden && adsConfig.mode !== "off";

  useEffect(() => {
    if (!enabled || adsConfig.mode !== "adsense" || !slot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // Ad blockers or script failures must not affect the page.
    }
  }, [enabled, slot]);

  if (!enabled) return null;

  const minHeight = adsConfig.minHeight[placement];
  return (
    <aside aria-label="Advertisement" className={cn("flex flex-col gap-1", className)}>
      <span className="text-[10px] font-medium tracking-wider text-subtle-foreground uppercase">Advertisement</span>
      {adsConfig.mode === "adsense" && slot && adsConfig.adsenseClient ? (
        <ins
          className="adsbygoogle block"
          style={{ minHeight }}
          data-ad-client={adsConfig.adsenseClient}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-lg border border-dashed border-border-strong text-xs text-subtle-foreground"
          style={{ minHeight }}
        >
          Ad placeholder · {placement}
        </div>
      )}
    </aside>
  );
}
