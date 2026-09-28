import type { LeadVertical } from "@/calculators/types";
import { leadGenConfig, monetizationPreview } from "@/config/monetization";
import { buttonVariants } from "@/components/ui/button";

/** Low-key lead generation block. Disabled per vertical by default. */
export function LeadGenBlock({ vertical }: { vertical?: LeadVertical }) {
  if (!vertical) return null;
  const config = leadGenConfig[vertical];
  if (!(config.enabled && config.url) && !monetizationPreview) return null;

  return (
    <aside aria-label="Professional help" className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-semibold">{config.headline}</h2>
        <p className="text-sm text-muted-foreground">{config.description}</p>
      </div>
      {config.enabled && config.url ? (
        <a href={config.url} rel="sponsored noopener" className={buttonVariants({ variant: "outline", size: "sm" })}>
          {config.cta}
        </a>
      ) : (
        <span className="text-xs text-subtle-foreground">Lead-gen placeholder · {vertical}</span>
      )}
    </aside>
  );
}
