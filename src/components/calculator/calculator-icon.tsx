import {
  Briefcase,
  Building2,
  Calculator,
  Clock,
  CreditCard,
  HardHat,
  Home,
  Key,
  Landmark,
  LineChart,
  Percent,
  PiggyBank,
  Receipt,
  Ruler,
  Scale,
  Tag,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { CalculatorIcon as IconName } from "@/calculators/types";

const icons: Record<IconName, LucideIcon> = {
  home: Home,
  landmark: Landmark,
  "trending-up": TrendingUp,
  "piggy-bank": PiggyBank,
  "credit-card": CreditCard,
  wallet: Wallet,
  percent: Percent,
  clock: Clock,
  building: Building2,
  key: Key,
  receipt: Receipt,
  briefcase: Briefcase,
  users: Users,
  "line-chart": LineChart,
  scale: Scale,
  tag: Tag,
  "hard-hat": HardHat,
  ruler: Ruler,
  calculator: Calculator,
  utensils: UtensilsCrossed,
};

export function CalculatorIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = icons[name] ?? Calculator;
  return <Icon aria-hidden className={className} />;
}
