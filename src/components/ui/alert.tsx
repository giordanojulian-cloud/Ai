import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AlertVariant = "info" | "warning" | "error" | "success";

const variants: Record<AlertVariant, string> = {
  info: "border-border bg-surface-muted text-foreground",
  warning: "border-warning/30 bg-warning-soft text-foreground",
  error: "border-negative/30 bg-negative-soft text-foreground",
  success: "border-positive/30 bg-positive-soft text-foreground",
};

export function Alert({
  className,
  variant = "info",
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: AlertVariant }) {
  return (
    <div
      role={variant === "error" ? "alert" : undefined}
      className={cn("rounded-lg border px-4 py-3 text-sm", variants[variant], className)}
      {...props}
    />
  );
}
