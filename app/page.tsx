"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MapContainer } from "@/components/map/map-container";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { RestaurantFiltersBar } from "@/components/restaurant/restaurant-filters";
import { Button } from "@/components/ui/button";
import { useRestaurants, useNearbyRestaurants } from "@/lib/hooks/use-restaurants";
import { useGeolocation } from "@/lib/hooks/use-geolocation";
import { Locate, List, MapIcon } from "lucide-react";
import type { RestaurantFilters } from "@/lib/types";

export default function HomePage() {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [view, setView] = useState<"map" | "list">("map");
  const { restaurants, loading } = useRestaurants(filters);
  const {
    lat,
    lng,
    requestLocation,
    loading: geoLoading,
  } = useGeolocation();
  const { restaurants: nearbyRestaurants } = useNearbyRestaurants(
    lat && lng ? { lat, lng } : null
  );

  const displayRestaurants =
    lat && lng && nearbyRestaurants.length > 0
      ? nearbyRestaurants
      : restaurants;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-green-50 to-background dark:from-green-950/20 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Find Vegetarian Food in Taipei
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover {restaurants.length > 0 ? `${restaurants.length}+` : ""}{" "}
                vegetarian restaurants with English menus, reviews, and
                AI-translated menu items.
              </p>
            </div>

            {/* Filters */}
            <RestaurantFiltersBar
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        </section>

        {/* Map / List Toggle + Near Me */}
        <section className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant={view === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("map")}
              >
                <MapIcon className="h-4 w-4 mr-1" />
                Map
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("list")}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={requestLocation}
              disabled={geoLoading}
            >
              <Locate className="h-4 w-4 mr-1" />
              {geoLoading ? "Locating..." : "Near Me"}
            </Button>
          </div>

          {/* Map View */}
          {view === "map" && (
            <MapContainer
              restaurants={displayRestaurants}
              userLocation={lat && lng ? { lat, lng } : null}
              className="w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden"
            />
          )}

          {/* List View */}
          {view === "list" && (
            <>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-72 bg-muted rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : displayRestaurants.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    No restaurants found matching your filters.
                  </p>
                  <Button
                    variant="link"
                    onClick={() => setFilters({})}
                    className="mt-2"
                  >
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Show list below map */}
          {view === "map" && displayRestaurants.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">
                {lat && lng ? "Restaurants Near You" : "All Restaurants"}
                <span className="text-muted-foreground font-normal text-base ml-2">
                  ({displayRestaurants.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayRestaurants.slice(0, 6).map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                  />
                ))}
              </div>
              {displayRestaurants.length > 6 && (
                <div className="text-center mt-4">
                  <Button variant="outline" onClick={() => setView("list")}>
                    View All {displayRestaurants.length} Restaurants
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
