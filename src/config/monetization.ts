import type { AffiliateVertical, LeadVertical } from "@/calculators/types";

/**
 * Monetization configuration. Everything is OFF by default so the site never
 * shows fake offers. Set NEXT_PUBLIC_MONETIZATION_PREVIEW=true locally to see
 * labeled placeholders for every placement.
 */

export type AdPlacement = "below-result" | "in-content" | "sidebar";

export const adsConfig = {
  /** off | placeholder | adsense. Other networks (Mediavine, Raptive) usually inject via their own script. */
  mode: (process.env.NEXT_PUBLIC_ADS_MODE ?? "off") as "off" | "placeholder" | "adsense",
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
  adsenseSlots: {
    "below-result": process.env.NEXT_PUBLIC_ADSENSE_SLOT_BELOW_RESULT,
    "in-content": process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT,
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  } satisfies Record<AdPlacement, string | undefined>,
  /** Reserved heights prevent layout shift when an ad loads. */
  minHeight: { "below-result": 250, "in-content": 250, sidebar: 600 } satisfies Record<AdPlacement, number>,
} as const;

export const monetizationPreview = process.env.NEXT_PUBLIC_MONETIZATION_PREVIEW === "true";

export interface AffiliateOffer {
  partner: string;
  headline: string;
  description: string;
  cta: string;
  /** Tracking URL from the affiliate network. */
  url: string;
}

/**
 * Add real partner offers here once agreements are signed. An empty list
 * disables the placement for that vertical.
 * TODO: move to the database when the partner list needs non-deploy edits.
 */
export const affiliateOffers: Record<AffiliateVertical, AffiliateOffer[]> = {
  mortgage: [],
  brokerage: [],
  savings: [],
  debt: [],
  "business-software": [],
  payroll: [],
};

export const affiliateVerticalLabels: Record<AffiliateVertical, string> = {
  mortgage: "Compare mortgage lenders",
  brokerage: "Compare investment accounts",
  savings: "Compare high-yield savings accounts",
  debt: "Compare debt consolidation options",
  "business-software": "Accounting & business software",
  payroll: "Payroll & HR software",
};

export interface LeadGenConfig {
  enabled: boolean;
  headline: string;
  description: string;
  cta: string;
  /** Destination form or partner URL. */
  url?: string;
}

/** Lead generation is intentionally opt-in per vertical and off in the MVP. */
export const leadGenConfig: Record<LeadVertical, LeadGenConfig> = {
  mortgage: {
    enabled: false,
    headline: "Talk to a mortgage professional",
    description: "Get a personalized rate quote based on your credit and location.",
    cta: "Get a quote",
  },
  "real-estate-agent": {
    enabled: false,
    headline: "Work with a local agent",
    description: "Connect with an experienced agent in your area.",
    cta: "Find an agent",
  },
  contractor: {
    enabled: false,
    headline: "Get contractor quotes",
    description: "Compare quotes from local, licensed contractors.",
    cta: "Request quotes",
  },
  "financial-advisor": {
    enabled: false,
    headline: "Speak with a financial advisor",
    description: "Find a fiduciary advisor to review your plan.",
    cta: "Find an advisor",
  },
};
