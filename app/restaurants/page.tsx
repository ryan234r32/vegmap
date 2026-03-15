"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { RestaurantFiltersBar } from "@/components/restaurant/restaurant-filters";
import { useRestaurants } from "@/lib/hooks/use-restaurants";
import type { RestaurantFilters } from "@/lib/types";

export default function RestaurantsPage() {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const { restaurants, loading } = useRestaurants(filters);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Vegetarian Restaurants</h1>

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
          ) : restaurants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No restaurants found.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {restaurants.length} restaurants found
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
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
