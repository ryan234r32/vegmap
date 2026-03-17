"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchAutocomplete } from "./search-autocomplete";
import { X } from "lucide-react";
import {
  VEGETARIAN_TYPES,
  TAIPEI_DISTRICTS,
  PRICE_RANGES,
} from "@/constants";
import type { RestaurantFilters, VegetarianType, PriceRange } from "@/lib/types";

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

  const toggleDistrict = (district: string) => {
    const current = filters.districts ?? [];
    const updated = current.includes(district)
      ? current.filter((d) => d !== district)
      : [...current, district];
    onFiltersChange({ ...filters, districts: updated });
  };

  const togglePrice = (price: PriceRange) => {
    const current = filters.priceRanges ?? [];
    const updated = current.includes(price)
      ? current.filter((p) => p !== price)
      : [...current, price];
    onFiltersChange({ ...filters, priceRanges: updated });
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const clearFilters = () => {
    setSearchInput("");
    onFiltersChange({});
  };

  const hasActiveFilters =
    (filters.vegetarianTypes?.length ?? 0) > 0 ||
    (filters.districts?.length ?? 0) > 0 ||
    (filters.priceRanges?.length ?? 0) > 0 ||
    filters.search;

  return (
    <div className="space-y-4">
      {/* Search with Autocomplete */}
      <div className="flex gap-2">
        <SearchAutocomplete
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
        />
        <Button onClick={() => handleSearch(searchInput)} size="default">
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

      {/* District Toggles */}
      <div className="flex flex-wrap gap-1.5">
        {TAIPEI_DISTRICTS.map((district) => {
          const isActive = filters.districts?.includes(district);
          return (
            <Badge
              key={district}
              variant={isActive ? "default" : "outline"}
              className="cursor-pointer select-none text-xs"
              onClick={() => toggleDistrict(district)}
            >
              {district}
            </Badge>
          );
        })}
      </div>

      {/* Price + Sort row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Price Toggles */}
        {PRICE_RANGES.map((p) => {
          const isActive = filters.priceRanges?.includes(p.value);
          return (
            <Badge
              key={p.value}
              variant={isActive ? "default" : "outline"}
              className="cursor-pointer select-none"
              onClick={() => togglePrice(p.value)}
            >
              {p.value}
            </Badge>
          );
        })}

        <div className="ml-auto flex items-center gap-2">
          {/* Sort dropdown (remains single select) */}
          <Select
            value={filters.sortBy ?? "rating"}
            onValueChange={(v) =>
              onFiltersChange({
                ...filters,
                sortBy: (v ?? "rating") as RestaurantFilters["sortBy"],
              })
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="english_friendly">English Friendly</SelectItem>
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
    </div>
  );
}
