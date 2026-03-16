"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, MapPin, X } from "lucide-react";
import Link from "next/link";
import type { Restaurant } from "@/lib/types";

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
}

export function SearchAutocomplete({
  value,
  onChange,
  onSearch,
  placeholder = "Search restaurants...",
}: SearchAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Restaurant[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("restaurants")
      .select("id, name_en, name_zh, slug, district, vegetarian_types")
      .eq("is_active", true)
      .or(
        `name_en.ilike.%${query}%,name_zh.ilike.%${query}%,cuisine_tags.cs.{${query}}`
      )
      .limit(6);

    setSuggestions((data as Restaurant[]) ?? []);
    setLoading(false);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.length >= 2) {
        fetchSuggestions(value);
        setOpen(true);
      } else {
        setSuggestions([]);
        setOpen(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, fetchSuggestions]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setOpen(false);
            onSearch(value);
          }
        }}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true);
        }}
        className="pl-9 pr-8"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            onSearch("");
            setSuggestions([]);
            setOpen(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 overflow-hidden">
          {suggestions.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors"
            >
              <div className="bg-green-100 dark:bg-green-900 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                <span className="text-sm">🌱</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {restaurant.name_en}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {restaurant.name_zh && (
                    <span className="truncate">{restaurant.name_zh}</span>
                  )}
                  {restaurant.district && (
                    <>
                      <span className="mx-1">·</span>
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>{restaurant.district}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
          {value.length >= 2 && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onSearch(value);
              }}
              className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-accent border-t"
            >
              Search all for &quot;{value}&quot;
            </button>
          )}
        </div>
      )}

      {open && loading && suggestions.length === 0 && value.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 p-3 text-sm text-muted-foreground">
          Searching...
        </div>
      )}
    </div>
  );
}
