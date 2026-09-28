import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight" aria-label={`${siteConfig.name} home`}>
      <span aria-hidden className="flex size-7 items-center justify-center rounded-md bg-foreground text-[11px] font-bold text-background">
        {siteConfig.logoMark}
      </span>
      <span className="text-[15px]">{siteConfig.name}</span>
    </Link>
  );
}
