"use client";

import { Badge } from "@/components/ui/badge";
import type { Menu, MenuItem } from "@/lib/types";

interface MenuDisplayProps {
  menu: Menu;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  ai_translated: "bg-blue-100 text-blue-800",
  community_reviewed: "bg-purple-100 text-purple-800",
  verified: "bg-green-100 text-green-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pending Translation",
  ai_translated: "AI Translated",
  community_reviewed: "Community Reviewed",
  verified: "Verified",
};

export function MenuDisplay({ menu }: MenuDisplayProps) {
  const groupedItems = menu.items.reduce(
    (acc, item) => {
      const category = item.category ?? "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-semibold text-lg">Menu</h3>
        <Badge className={statusColors[menu.translation_status] ?? ""}>
          {statusLabels[menu.translation_status] ?? menu.translation_status}
        </Badge>
      </div>

      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-2">
            {category}
          </h4>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {item.name_en}
                    </span>
                    {item.is_vegan && (
                      <Badge variant="secondary" className="text-xs">
                        Vegan
                      </Badge>
                    )}
                  </div>
                  {item.name_zh && (
                    <p className="text-xs text-muted-foreground">
                      {item.name_zh}
                    </p>
                  )}
                  {item.description_en && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.description_en}
                    </p>
                  )}
                  {item.allergens.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {item.allergens.map((a) => (
                        <Badge
                          key={a}
                          variant="outline"
                          className="text-xs text-orange-600"
                        >
                          {a}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {item.price && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    NT${item.price}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
