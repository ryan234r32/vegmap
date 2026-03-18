"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { RestaurantFiltersBar } from "@/components/restaurant/restaurant-filters";
import { useRestaurants } from "@/lib/hooks/use-restaurants";
import { useGeolocation } from "@/lib/hooks/use-geolocation";
import { getDistanceKm } from "@/lib/geo";
import { Button } from "@/components/ui/button";
import { Locate } from "lucide-react";
import type { RestaurantFilters } from "@/lib/types";

export default function RestaurantsPage() {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const { restaurants, loading } = useRestaurants(filters);
  const {
    lat,
    lng,
    error: geoError,
    requestLocation,
    loading: geoLoading,
  } = useGeolocation();

  // Auto-request location when distance sort is selected
  useEffect(() => {
    if (filters.sortBy === "distance" && !lat && !lng && !geoLoading) {
      requestLocation();
    }
  }, [filters.sortBy, lat, lng, geoLoading, requestLocation]);

  // Client-side distance sorting
  const displayRestaurants = useMemo(() => {
    if (filters.sortBy !== "distance" || !lat || !lng) return restaurants;
    return [...restaurants].sort((a, b) => {
      const distA = a.location
        ? getDistanceKm({ lat, lng }, a.location)
        : Infinity;
      const distB = b.location
        ? getDistanceKm({ lat, lng }, b.location)
        : Infinity;
      return distA - distB;
    });
  }, [restaurants, filters.sortBy, lat, lng]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Vegetarian Restaurants</h1>
          <Button
            variant={filters.sortBy === "distance" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              if (filters.sortBy === "distance") {
                setFilters((prev) => ({ ...prev, sortBy: undefined }));
              } else {
                requestLocation();
                setFilters((prev) => ({ ...prev, sortBy: "distance" }));
              }
            }}
            disabled={geoLoading}
          >
            <Locate className="h-4 w-4 mr-1" />
            {geoLoading ? "Locating..." : "Near Me"}
          </Button>
        </div>

        {geoError && filters.sortBy === "distance" && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded mb-4">
            {geoError}
          </div>
        )}

        <RestaurantFiltersBar
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 bg-muted rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : displayRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No restaurants found.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {displayRestaurants.length} restaurants found
                {filters.sortBy === "distance" && lat && " · sorted by distance"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    distance={
                      filters.sortBy === "distance" && lat && lng && restaurant.location
                        ? getDistanceKm({ lat, lng }, restaurant.location)
                        : undefined
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
