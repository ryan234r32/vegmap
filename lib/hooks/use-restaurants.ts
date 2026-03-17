"use client";

import { useEffect, useState, useCallback } from "react";
import type { Restaurant, RestaurantFilters, NearbyParams } from "@/lib/types";

export function useRestaurants(filters?: RestaurantFilters) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (filters?.vegetarianTypes && filters.vegetarianTypes.length > 0) {
      params.set("vegTypes", filters.vegetarianTypes.join(","));
    }
    if (filters?.district) params.set("district", filters.district);
    if (filters?.priceRange) params.set("priceRange", filters.priceRange);
    if (filters?.minRating) params.set("minRating", String(filters.minRating));
    if (filters?.search) params.set("search", filters.search);
    if (filters?.sortBy) params.set("sortBy", filters.sortBy);

    try {
      const res = await fetch(`/api/restaurants?${params.toString()}`);
      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setRestaurants((json.data as Restaurant[]) ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch restaurants");
    }
    setLoading(false);
  }, [filters?.vegetarianTypes, filters?.district, filters?.priceRange, filters?.minRating, filters?.search, filters?.sortBy]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return { restaurants, loading, error, refetch: fetchRestaurants };
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
