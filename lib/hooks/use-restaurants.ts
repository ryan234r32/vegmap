"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Restaurant, RestaurantFilters, NearbyParams } from "@/lib/types";

export function useRestaurants(filters?: RestaurantFilters) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("restaurants")
      .select("*")
      .eq("is_active", true);

    if (filters?.vegetarianTypes && filters.vegetarianTypes.length > 0) {
      query = query.overlaps("vegetarian_types", filters.vegetarianTypes);
    }

    if (filters?.district) {
      query = query.eq("district", filters.district);
    }

    if (filters?.priceRange) {
      query = query.eq("price_range", filters.priceRange);
    }

    if (filters?.minRating) {
      query = query.gte("avg_rating", filters.minRating);
    }

    if (filters?.search) {
      query = query.or(
        `name_en.ilike.%${filters.search}%,name_zh.ilike.%${filters.search}%,description_en.ilike.%${filters.search}%`
      );
    }

    switch (filters?.sortBy) {
      case "rating":
        query = query.order("avg_rating", { ascending: false });
        break;
      case "reviews":
        query = query.order("review_count", { ascending: false });
        break;
      case "name":
        query = query.order("name_en", { ascending: true });
        break;
      default:
        query = query.order("avg_rating", { ascending: false });
    }

    const { data, error: err } = await query.limit(100);

    if (err) {
      setError(err.message);
    } else {
      setRestaurants((data as Restaurant[]) ?? []);
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
  const supabase = createClient();

  useEffect(() => {
    if (!params) return;

    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase.rpc("nearby_restaurants", {
        lat: params.lat,
        lng: params.lng,
        radius_meters: params.radius ?? 2000,
        result_limit: params.limit ?? 50,
      });
      setRestaurants((data as Restaurant[]) ?? []);
      setLoading(false);
    };

    fetch();
  }, [params?.lat, params?.lng, params?.radius, params?.limit]);

  return { restaurants, loading };
}
