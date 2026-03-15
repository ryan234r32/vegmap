"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import {
  VEGETARIAN_TYPES,
  TAIPEI_DISTRICTS,
  PRICE_RANGES,
} from "@/constants";
import type { RestaurantFilters, VegetarianType } from "@/lib/types";

interface RestaurantFiltersProps {
  filters: RestaurantFilters;
  onFiltersChange: (filters: RestaurantFilters) => void;
}

export function RestaurantFiltersBar({
  filters,
  onFiltersChange,
}: RestaurantFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? "");

  const toggleVegType = (type: VegetarianType) => {
    const current = filters.vegetarianTypes ?? [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onFiltersChange({ ...filters, vegetarianTypes: updated });
  };

  const handleSearch = () => {
    onFiltersChange({ ...filters, search: searchInput || undefined });
  };

  const clearFilters = () => {
    setSearchInput("");
    onFiltersChange({});
  };

  const hasActiveFilters =
    (filters.vegetarianTypes?.length ?? 0) > 0 ||
    filters.district ||
    filters.priceRange ||
    filters.search;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search restaurants..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} size="default">
          Search
        </Button>
      </div>

      {/* Veg Type Toggles */}
      <div className="flex flex-wrap gap-2">
        {VEGETARIAN_TYPES.map((type) => {
          const isActive = filters.vegetarianTypes?.includes(type.value);
          return (
            <Badge
              key={type.value}
              variant={isActive ? "default" : "outline"}
              className="cursor-pointer select-none"
              onClick={() => toggleVegType(type.value)}
            >
              {type.emoji} {type.label}
            </Badge>
          );
        })}
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.district ?? "all"}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              district: !v || v === "all" ? undefined : v,
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Districts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {TAIPEI_DISTRICTS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.priceRange ?? "all"}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              priceRange: !v || v === "all" ? undefined : (v as "$" | "$$" | "$$$" | "$$$$"),
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Any Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Price</SelectItem>
            {PRICE_RANGES.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy ?? "rating"}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              sortBy: (v ?? "rating") as RestaurantFilters["sortBy"],
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
