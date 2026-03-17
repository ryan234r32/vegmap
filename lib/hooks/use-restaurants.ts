"use client";

import { useEffect, useState, useRef } from "react";
import type { Restaurant, RestaurantFilters, NearbyParams } from "@/lib/types";

// Serialize filters to a stable string for dependency comparison
function serializeFilters(f?: RestaurantFilters): string {
  if (!f) return "";
  return JSON.stringify({
    v: f.vegetarianTypes?.sort() ?? [],
    d: f.districts?.sort() ?? [],
    p: f.priceRanges?.sort() ?? [],
    m: f.minRating ?? 0,
    s: f.search ?? "",
    o: f.sortBy ?? "rating",
  });
}

export function useRestaurants(filters?: RestaurantFilters) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const filterKey = serializeFilters(filters);

  useEffect(() => {
    // Debounce: wait 150ms before fetching (fast enough to feel responsive)
    const timer = setTimeout(() => {
      // Abort previous in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.vegetarianTypes && filters.vegetarianTypes.length > 0) {
        params.set("vegTypes", filters.vegetarianTypes.join(","));
      }
      if (filters?.districts && filters.districts.length > 0) {
        params.set("districts", filters.districts.join(","));
      }
      if (filters?.priceRanges && filters.priceRanges.length > 0) {
        params.set("priceRanges", filters.priceRanges.join(","));
      }
      if (filters?.minRating) params.set("minRating", String(filters.minRating));
      if (filters?.search) params.set("search", filters.search);
      if (filters?.sortBy) params.set("sortBy", filters.sortBy);

      fetch(`/api/restaurants?${params.toString()}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((json) => {
          if (json.error) {
            setError(json.error);
          } else {
            setRestaurants((json.data as Restaurant[]) ?? []);
          }
          setLoading(false);
        })
        .catch((err) => {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setError("Failed to fetch restaurants");
          setLoading(false);
        });
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [filterKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { restaurants, loading, error };
}

export function useNearbyRestaurants(params: NearbyParams | null) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!params) return;

    const fetchNearby = async () => {
      setLoading(true);
      try {
        const qs = new URLSearchParams({
          lat: String(params.lat),
          lng: String(params.lng),
          radius: String(params.radius ?? 2000),
          limit: String(params.limit ?? 50),
        });
        const res = await fetch(`/api/restaurants/nearby?${qs.toString()}`);
        const json = await res.json();
        setRestaurants((json.data as Restaurant[]) ?? []);
      } catch {
        setRestaurants([]);
      }
      setLoading(false);
    };

    fetchNearby();
  }, [params?.lat, params?.lng, params?.radius, params?.limit]);

  return { restaurants, loading };
}
