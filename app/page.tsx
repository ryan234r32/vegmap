"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MapContainer } from "@/components/map/map-container";
import { BottomSheet, type SheetPosition } from "@/components/map/bottom-sheet";
import { PreviewCard } from "@/components/map/preview-card";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { RestaurantFiltersBar } from "@/components/restaurant/restaurant-filters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRestaurants, useNearbyRestaurants } from "@/lib/hooks/use-restaurants";
import { useGeolocation } from "@/lib/hooks/use-geolocation";
import { Locate, List, MapIcon, Moon, Utensils, CreditCard, Star, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TAIPEI_DISTRICTS, VEGETARIAN_TYPES } from "@/constants";
import { WelcomeSheet } from "@/components/onboarding/welcome-sheet";
import type { RestaurantFilters, Restaurant, VegetarianType } from "@/lib/types";

const PAGE_SIZE = 24;

export default function HomePage() {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [view, setView] = useState<"map" | "list">("map");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const { restaurants, loading } = useRestaurants(filters);
  const {
    lat,
    lng,
    error: geoError,
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

  const handleMarkerClick = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  }, []);

  const handleSheetPositionChange = useCallback((pos: SheetPosition) => {
    if (pos !== "peek") {
      setSelectedRestaurant(null);
    }
  }, []);

  const userLocation = lat && lng ? { lat, lng } : null;

  const handleOnboardingComplete = useCallback(
    (diet: VegetarianType | null, shouldLocate: boolean) => {
      if (diet) {
        setFilters((prev) => ({ ...prev, vegetarianTypes: [diet] }));
      }
      if (shouldLocate) {
        requestLocation();
      }
    },
    [requestLocation]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <WelcomeSheet onComplete={handleOnboardingComplete} />

      <main className="flex-1 flex flex-col">
        {/* ===== DESKTOP LAYOUT ===== */}

        {/* Hero Section - desktop only */}
        <section className="hidden md:block bg-gradient-to-b from-green-50 to-background dark:from-green-950/20 py-8 md:py-12">
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
            <RestaurantFiltersBar filters={filters} onFiltersChange={setFilters} />
          </div>
        </section>

        {/* Desktop: Map/List toggle + content */}
        <section className="hidden md:block container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button variant={view === "map" ? "default" : "outline"} size="sm" onClick={() => setView("map")}>
                <MapIcon className="h-4 w-4 mr-1" /> Map
              </Button>
              <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>
                <List className="h-4 w-4 mr-1" /> List
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {geoError && (
                <span className="text-xs text-red-500 max-w-[200px] truncate" title={geoError}>{geoError}</span>
              )}
              <Button variant="outline" size="sm" onClick={requestLocation} disabled={geoLoading}>
                <Locate className="h-4 w-4 mr-1" />
                {geoLoading ? "Locating..." : "Near Me"}
              </Button>
            </div>
          </div>

          {/* Desktop Map View */}
          {view === "map" && (
            <div className="relative">
              <MapContainer
                restaurants={displayRestaurants}
                userLocation={userLocation}
                onMarkerClick={handleMarkerClick}
                className="w-full h-[600px] rounded-lg overflow-hidden"
              />
              {selectedRestaurant && (
                <PreviewCard
                  restaurant={selectedRestaurant}
                  onClose={() => setSelectedRestaurant(null)}
                  userLocation={userLocation}
                />
              )}
            </div>
          )}

          {/* Desktop List View */}
          {view === "list" && (
            <>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-72 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : displayRestaurants.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No restaurants found matching your filters.</p>
                  <Button variant="link" onClick={() => setFilters({})} className="mt-2">Clear all filters</Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayRestaurants.slice(0, visibleCount).map((restaurant) => (
                      <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                  </div>
                  {visibleCount < displayRestaurants.length && (
                    <div className="text-center mt-6">
                      <Button variant="outline" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                        Load More ({displayRestaurants.length - visibleCount} remaining)
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Desktop: list below map */}
          {view === "map" && displayRestaurants.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">
                {lat && lng ? "Restaurants Near You" : "All Restaurants"}
                <span className="text-muted-foreground font-normal text-base ml-2">({displayRestaurants.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayRestaurants.slice(0, 6).map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
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

        {/* Desktop: Quick Links */}
        <section className="hidden md:block container mx-auto px-4 py-8 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Browse by District</h3>
              <div className="flex flex-wrap gap-1.5">
                {TAIPEI_DISTRICTS.map((d) => (
                  <button
                    key={d}
                    onClick={() => { setFilters({ districts: [d] }); setView("list"); setVisibleCount(PAGE_SIZE); }}
                    className="text-xs px-2.5 py-1 rounded-full border hover:bg-accent transition-colors cursor-pointer"
                  >{d}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Traveler Tools</h3>
              <div className="space-y-2">
                <Link href="/tools/diet-card" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <CreditCard className="h-4 w-4" /> Diet Communication Card
                </Link>
                <Link href="/night-markets" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Moon className="h-4 w-4" /> Night Market Guide
                </Link>
                <Link href="/restaurants/suggest" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Utensils className="h-4 w-4" /> Suggest a Restaurant
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Popular Cuisines</h3>
              <div className="flex flex-wrap gap-1.5">
                {["Taiwanese", "Japanese", "Indian", "Italian", "Thai", "Hot Pot", "Buffet", "Bakery"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => { setFilters({ search: tag }); setView("list"); setVisibleCount(PAGE_SIZE); }}
                    className="text-xs px-2.5 py-1 rounded-full border hover:bg-accent transition-colors cursor-pointer"
                  >{tag}</button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== MOBILE LAYOUT ===== */}
        <div className="md:hidden relative flex-1">
          <MapContainer
            restaurants={displayRestaurants}
            userLocation={userLocation}
            onMarkerClick={handleMarkerClick}
            className="w-full h-[calc(100vh-3.5rem)]"
          />

          {/* Mobile: Floating Near Me button */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full shadow-md"
              onClick={requestLocation}
              disabled={geoLoading}
            >
              <Locate className={`h-4 w-4 ${geoLoading ? "animate-pulse" : ""}`} />
            </Button>
          </div>

          {/* Mobile: Geo error toast */}
          {geoError && (
            <div className="absolute top-3 left-3 right-16 z-10">
              <div className="bg-destructive/90 text-destructive-foreground text-xs px-3 py-2 rounded-lg shadow">
                {geoError}
              </div>
            </div>
          )}

          {/* Mobile: Preview Card (above bottom sheet) */}
          {selectedRestaurant && (
            <PreviewCard
              restaurant={selectedRestaurant}
              onClose={() => setSelectedRestaurant(null)}
              userLocation={userLocation}
            />
          )}

          {/* Mobile: Bottom Sheet */}
          <BottomSheet
            onPositionChange={handleSheetPositionChange}
            peekContent={
              <div>
                <p className="text-sm font-medium mb-2">
                  {lat && lng ? "Near You" : "All Restaurants"}{" "}
                  <span className="text-muted-foreground font-normal">({displayRestaurants.length})</span>
                </p>
                <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                  {VEGETARIAN_TYPES.map((type) => {
                    const isActive = filters.vegetarianTypes?.includes(type.value);
                    return (
                      <Badge
                        key={type.value}
                        variant={isActive ? "default" : "outline"}
                        className="cursor-pointer select-none whitespace-nowrap text-xs flex-shrink-0"
                        onClick={() => {
                          const current = filters.vegetarianTypes ?? [];
                          const updated = current.includes(type.value)
                            ? current.filter((t) => t !== type.value)
                            : [...current, type.value];
                          setFilters({ ...filters, vegetarianTypes: updated });
                        }}
                      >
                        {type.emoji} {type.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            }
          >
            {/* Bottom sheet scrollable content */}
            <div className="space-y-0 -mx-4">
              {displayRestaurants.map((restaurant) => (
                <CompactRestaurantItem key={restaurant.id} restaurant={restaurant} />
              ))}
              {displayRestaurants.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No restaurants found.</p>
                  <Button variant="link" size="sm" onClick={() => setFilters({})}>Clear filters</Button>
                </div>
              )}
              {loading && (
                <div className="space-y-0">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-3 p-3 border-b">
                      <div className="w-16 h-16 rounded-lg bg-muted animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                        <div className="h-3 bg-muted rounded animate-pulse w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BottomSheet>
        </div>
      </main>

      {/* Footer - desktop only */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}

/** Compact restaurant row for mobile bottom sheet */
function CompactRestaurantItem({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link
      href={`/restaurants/${restaurant.slug}`}
      className="flex gap-3 p-3 border-b hover:bg-muted/50 transition-colors"
    >
      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
        {restaurant.cover_image_url ? (
          <Image
            src={restaurant.cover_image_url}
            alt={restaurant.name_en}
            fill
            className="object-cover"
            sizes="64px"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">🌱</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{restaurant.name_en}</h4>
        {restaurant.name_zh && (
          <p className="text-xs text-muted-foreground truncate">{restaurant.name_zh}</p>
        )}
        <div className="flex items-center gap-2 mt-0.5">
          {restaurant.avg_rating > 0 && (
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{restaurant.avg_rating}</span>
              <span className="text-xs text-muted-foreground">({restaurant.review_count})</span>
            </div>
          )}
          {restaurant.district && (
            <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {restaurant.district}
            </div>
          )}
          {restaurant.price_range && (
            <span className="text-xs text-muted-foreground">{restaurant.price_range}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
