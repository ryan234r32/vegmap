import { Badge } from "@/components/ui/badge";
import { VEGETARIAN_TYPES } from "@/constants";
import type { VegetarianType } from "@/lib/types";

interface VegTypeBadgeProps {
  type: VegetarianType;
  size?: "sm" | "md";
}

export function VegTypeBadge({ type, size = "sm" }: VegTypeBadgeProps) {
  const config = VEGETARIAN_TYPES.find((t) => t.value === type);
  if (!config) return null;

  return (
    <Badge
      variant="secondary"
      className={`${size === "sm" ? "text-xs" : "text-sm"} gap-1`}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </Badge>
  );
}
