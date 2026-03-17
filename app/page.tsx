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
import { Locate, List, MapIcon, Moon, Utensils, CreditCard } from "lucide-react";
import Link from "next/link";
import { TAIPEI_DISTRICTS } from "@/constants";
import type { RestaurantFilters } from "@/lib/types";

const PAGE_SIZE = 24;

export default function HomePage() {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [view, setView] = useState<"map" | "list">("map");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
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
              className="w-full h-[300px] sm:h-[400px] md:h-[600px] rounded-lg overflow-hidden"
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
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayRestaurants.slice(0, visibleCount).map((restaurant) => (
                      <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                      />
                    ))}
                  </div>
                  {visibleCount < displayRestaurants.length && (
                    <div className="text-center mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                      >
                        Load More ({displayRestaurants.length - visibleCount} remaining)
                      </Button>
                    </div>
                  )}
                </>
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

        {/* Quick Links */}
        <section className="container mx-auto px-4 py-8 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* District Quick Links */}
            <div>
              <h3 className="font-semibold mb-3">Browse by District</h3>
              <div className="flex flex-wrap gap-1.5">
                {TAIPEI_DISTRICTS.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setFilters({ districts: [d] });
                      setView("list");
                      setVisibleCount(PAGE_SIZE);
                    }}
                    className="text-xs px-2.5 py-1 rounded-full border hover:bg-accent transition-colors cursor-pointer"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <h3 className="font-semibold mb-3">Traveler Tools</h3>
              <div className="space-y-2">
                <Link
                  href="/tools/diet-card"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  Diet Communication Card
                </Link>
                <Link
                  href="/night-markets"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Moon className="h-4 w-4" />
                  Night Market Guide
                </Link>
                <Link
                  href="/restaurants/suggest"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Utensils className="h-4 w-4" />
                  Suggest a Restaurant
                </Link>
              </div>
            </div>

            {/* Popular Cuisines */}
            <div>
              <h3 className="font-semibold mb-3">Popular Cuisines</h3>
              <div className="flex flex-wrap gap-1.5">
                {["Taiwanese", "Japanese", "Indian", "Italian", "Thai", "Hot Pot", "Buffet", "Bakery"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setFilters({ search: tag });
                      setView("list");
                      setVisibleCount(PAGE_SIZE);
                    }}
                    className="text-xs px-2.5 py-1 rounded-full border hover:bg-accent transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
