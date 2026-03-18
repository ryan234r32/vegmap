"use client";

import { useState, useMemo } from "react";
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
  MRT_STATIONS,
  MRT_LINE_COLORS,
} from "@/constants";
import type { MrtLine } from "@/constants";
import type { RestaurantFilters, VegetarianType, PriceRange } from "@/lib/types";

interface RestaurantFiltersProps {
  filters: RestaurantFilters;
  onFiltersChange: (filters: RestaurantFilters) => void;
}

// Popular stations foreigners commonly use (shown by default)
const POPULAR_STATIONS = new Set([
  "Taipei Main Station", "Zhongxiao Fuxing", "Taipei 101", "Ximen",
  "Daan", "Dongmen", "Zhongshan", "Xinyi Anhe", "Gongguan",
  "Nanjing Fuxing", "Shilin", "Jiantan", "Longshan Temple",
  "Technology Building", "Songjiang Nanjing",
]);

export function RestaurantFiltersBar({
  filters,
  onFiltersChange,
}: RestaurantFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  const [showAllStations, setShowAllStations] = useState(false);

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

  const toggleMrtStation = (station: string) => {
    const current = filters.mrtStations ?? [];
    const updated = current.includes(station)
      ? current.filter((s) => s !== station)
      : [...current, station];
    onFiltersChange({ ...filters, mrtStations: updated });
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const clearFilters = () => {
    setSearchInput("");
    onFiltersChange({});
  };

  // Deduplicate MRT stations (some appear on multiple lines)
  const uniqueStations = useMemo(() =>
    MRT_STATIONS.filter(
      (s, i, arr) => arr.findIndex((x) => x.name_en === s.name_en) === i
    ), []);

  // Split into popular (shown by default) and all
  const displayStations = useMemo(() => {
    if (showAllStations) return uniqueStations;
    // Show popular stations + any currently selected ones
    return uniqueStations.filter(
      s => POPULAR_STATIONS.has(s.name_en) || filters.mrtStations?.includes(s.name_en)
    );
  }, [showAllStations, uniqueStations, filters.mrtStations]);

  const hasActiveFilters =
    (filters.vegetarianTypes?.length ?? 0) > 0 ||
    (filters.districts?.length ?? 0) > 0 ||
    (filters.mrtStations?.length ?? 0) > 0 ||
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

      {/* MRT Station Toggles */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">By MRT Station</p>
        <div className="flex flex-wrap gap-1.5">
          {displayStations.map((station) => {
            const isActive = filters.mrtStations?.includes(station.name_en);
            return (
              <Badge
                key={station.name_en}
                variant={isActive ? "default" : "outline"}
                className="cursor-pointer select-none text-xs gap-1"
                onClick={() => toggleMrtStation(station.name_en)}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: MRT_LINE_COLORS[station.line as MrtLine] }}
                />
                {station.name_en}
              </Badge>
            );
          })}
          {!showAllStations && (
            <Badge
              variant="outline"
              className="cursor-pointer select-none text-xs opacity-70"
              onClick={() => setShowAllStations(true)}
            >
              +{uniqueStations.length - displayStations.length} more
            </Badge>
          )}
          {showAllStations && (
            <Badge
              variant="outline"
              className="cursor-pointer select-none text-xs opacity-70"
              onClick={() => setShowAllStations(false)}
            >
              Show less
            </Badge>
          )}
        </div>
      </div>

      {/* District Toggles */}
      <details className="group">
        <summary className="text-xs font-medium text-muted-foreground cursor-pointer select-none">
          By District <span className="text-xs opacity-60">(tap to expand)</span>
        </summary>
        <div className="flex flex-wrap gap-1.5 mt-2">
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
      </details>

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
              <SelectItem value="distance">Nearest to Me</SelectItem>
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
