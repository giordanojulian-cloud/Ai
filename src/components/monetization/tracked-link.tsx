"use client";

import type { AnchorHTMLAttributes } from "react";
import { track } from "@/lib/analytics";

/** Outbound partner link: marked sponsored, opens in a new tab, tracks clicks. */
export function AffiliateLink({
  vertical,
  partner,
  slug,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { vertical: string; partner: string; slug?: string }) {
  return (
    <a
      {...props}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={(event) => {
        track("affiliate_clicked", { vertical, partner, ...(slug ? { slug } : {}) });
        props.onClick?.(event);
      }}
    />
  );
}
