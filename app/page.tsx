"use client";

import { useState, useCallback, memo } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MapContainer } from "@/components/map/map-container";
import { BottomSheet } from "@/components/map/bottom-sheet";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { RestaurantFiltersBar } from "@/components/restaurant/restaurant-filters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRestaurants, useNearbyRestaurants } from "@/lib/hooks/use-restaurants";
import { useGeolocation } from "@/lib/hooks/use-geolocation";
import { Locate, List, MapIcon, Moon, Utensils, CreditCard, Star, MapPin, ChevronRight, Navigation, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TAIPEI_DISTRICTS, VEGETARIAN_TYPES, MRT_STATIONS, MRT_LINE_COLORS } from "@/constants";
import type { MrtLine } from "@/constants";
import { WelcomeSheet } from "@/components/onboarding/welcome-sheet";
import { VegTypeBadge } from "@/components/restaurant/veg-type-badge";
import type { RestaurantFilters, Restaurant, VegetarianType } from "@/lib/types";

const PAGE_SIZE = 24;
const MOBILE_PAGE_SIZE = 15;
const LIST_PEEK_HEIGHT = 180;
const DETAIL_PEEK_HEIGHT = 220;

function getDistanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export default function HomePage() {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [view, setView] = useState<"map" | "list">("map");
  const [mobileVisibleCount, setMobileVisibleCount] = useState(MOBILE_PAGE_SIZE);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
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

  const handleDismissDetail = useCallback(() => {
    setSelectedRestaurant(null);
  }, []);

  const userLocation = lat && lng ? { lat, lng } : null;

  const handleFavoriteNeedAuth = useCallback(() => {
    setShowAuthPrompt(true);
    setTimeout(() => setShowAuthPrompt(false), 4000);
  }, []);

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

  // Determine bottom sheet mode
  const isDetailMode = selectedRestaurant !== null;

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
              {/* Desktop: Preview card floats over map */}
              {selectedRestaurant && (
                <DesktopPreviewCard
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
                      <RestaurantCard key={restaurant.id} restaurant={restaurant} onFavoriteNeedAuth={handleFavoriteNeedAuth} />
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
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} onFavoriteNeedAuth={handleFavoriteNeedAuth} />
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
              <h3 className="font-semibold mb-3">Browse by MRT Station</h3>
              <div className="flex flex-wrap gap-1.5">
                {["Taipei Main Station", "Zhongxiao Fuxing", "Ximen", "Dongmen", "Daan", "Taipei 101", "Zhongshan", "Gongguan", "Shilin", "Jiantan", "Xinyi Anhe", "Nanjing Fuxing"].map((station) => {
                  const s = MRT_STATIONS.find(m => m.name_en === station);
                  const color = s ? MRT_LINE_COLORS[s.line as MrtLine] : undefined;
                  return (
                    <button
                      key={station}
                      onClick={() => { setFilters({ mrtStations: [station] }); setView("list"); setVisibleCount(PAGE_SIZE); }}
                      className="text-xs px-2.5 py-1 rounded-full border hover:bg-accent transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {color && <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />}
                      {station}
                    </button>
                  );
                })}
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
              className="h-11 w-11 rounded-full shadow-md"
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

          {/* Mobile: Bottom Sheet — switches between list and detail mode */}
          <BottomSheet
            peekHeight={isDetailMode ? DETAIL_PEEK_HEIGHT : LIST_PEEK_HEIGHT}
            resetKey={selectedRestaurant?.id ?? "list"}
            onDismiss={isDetailMode ? handleDismissDetail : undefined}
            peekContent={
              isDetailMode ? (
                /* === DETAIL MODE PEEK: restaurant preview === */
                <DetailPeekContent
                  restaurant={selectedRestaurant!}
                  userLocation={userLocation}
                  onClose={handleDismissDetail}
                />
              ) : (
                /* === LIST MODE PEEK: count + filter badges === */
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
                          onClick={(e) => {
                            e.stopPropagation();
                            const current = filters.vegetarianTypes ?? [];
                            const updated = current.includes(type.value)
                              ? current.filter((t) => t !== type.value)
                              : [...current, type.value];
                            setFilters({ ...filters, vegetarianTypes: updated });
                            setMobileVisibleCount(MOBILE_PAGE_SIZE);
                          }}
                        >
                          {type.emoji} {type.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )
            }
          >
            {isDetailMode ? (
              /* === DETAIL MODE SCROLL: more info + CTAs === */
              <DetailScrollContent
                restaurant={selectedRestaurant!}
                userLocation={userLocation}
              />
            ) : (
              /* === LIST MODE SCROLL: restaurant list === */
              <div className="space-y-0 -mx-4">
                {displayRestaurants.slice(0, mobileVisibleCount).map((restaurant) => (
                  <CompactRestaurantItem key={restaurant.id} restaurant={restaurant} />
                ))}
                {mobileVisibleCount < displayRestaurants.length && (
                  <div className="text-center py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMobileVisibleCount((c) => c + MOBILE_PAGE_SIZE)}
                    >
                      Show More ({displayRestaurants.length - mobileVisibleCount} remaining)
                    </Button>
                  </div>
                )}
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
            )}
          </BottomSheet>
        </div>
      </main>

      {/* Footer - desktop only */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Sign-in prompt when unauthenticated user tries to favorite */}
      {showAuthPrompt && (
        <div className="fixed bottom-6 left-4 right-4 z-50 md:left-auto md:right-6 md:max-w-sm animate-in slide-in-from-bottom-4 duration-200">
          <div className="bg-foreground text-background rounded-xl px-4 py-3 shadow-lg flex items-center justify-between gap-3">
            <p className="text-sm">Save your favorites — sign in first!</p>
            <Link
              href="/auth/login"
              className="text-sm font-semibold whitespace-nowrap underline underline-offset-2"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/** Detail mode: peek content showing selected restaurant preview */
function DetailPeekContent({
  restaurant,
  userLocation,
  onClose,
}: {
  restaurant: Restaurant;
  userLocation: { lat: number; lng: number } | null;
  onClose: () => void;
}) {
  const distance =
    userLocation && restaurant.location
      ? getDistanceKm(userLocation, restaurant.location)
      : null;

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex gap-3">
        {/* Image */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
          {restaurant.cover_image_url ? (
            <Image
              src={restaurant.cover_image_url}
              alt={restaurant.name_en}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              🌱
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-semibold text-sm leading-tight truncate">
              {restaurant.name_en}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 -mr-1 -mt-0.5 rounded-full hover:bg-muted flex-shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {restaurant.name_zh && (
            <p className="text-xs text-muted-foreground truncate">
              {restaurant.name_zh}
            </p>
          )}

          <div className="flex items-center gap-2 mt-1">
            {restaurant.avg_rating > 0 ? (
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{restaurant.avg_rating}</span>
                <span className="text-xs text-muted-foreground">({restaurant.review_count})</span>
              </div>
            ) : restaurant.google_rating ? (
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{restaurant.google_rating}</span>
                <span className="text-[10px] text-muted-foreground">Google</span>
              </div>
            ) : null}
            {distance !== null && (
              <span className="text-xs text-muted-foreground">
                {distance < 1
                  ? `${Math.round(distance * 1000)}m`
                  : `${distance.toFixed(1)}km`}
              </span>
            )}
            {restaurant.price_range && (
              <span className="text-xs text-muted-foreground">
                {restaurant.price_range}
              </span>
            )}
          </div>

          <div className="flex gap-1 mt-1">
            {restaurant.vegetarian_types.slice(0, 3).map((type) => (
              <VegTypeBadge key={type} type={type} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Detail mode: scrollable content with CTAs */
function DetailScrollContent({
  restaurant,
  userLocation,
}: {
  restaurant: Restaurant;
  userLocation: { lat: number; lng: number } | null;
}) {
  const googleMapsUrl = restaurant.location
    ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.location.lat},${restaurant.location.lng}`
    : null;

  const distance =
    userLocation && restaurant.location
      ? getDistanceKm(userLocation, restaurant.location)
      : null;

  return (
    <div className="-mx-4 animate-in fade-in duration-200">
      {/* Action Buttons */}
      <div className="flex gap-2 px-4 pb-4">
        <Link
          href={`/restaurants/${restaurant.slug}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-foreground text-background rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </Link>
        {googleMapsUrl && (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-5 py-3 border rounded-xl text-sm hover:bg-muted transition-colors"
          >
            <Navigation className="h-4 w-4" />
            Navigate
          </a>
        )}
      </div>

      {/* Extra Info */}
      <div className="border-t px-4 py-4 space-y-3">
        {restaurant.district && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>{restaurant.district} District, Taipei</span>
            {distance !== null && (
              <span className="text-xs">
                ({distance < 1
                  ? `${Math.round(distance * 1000)}m away`
                  : `${distance.toFixed(1)}km away`})
              </span>
            )}
          </div>
        )}

        {restaurant.nearest_mrt && (() => {
          const station = MRT_STATIONS.find(s => s.name_en === restaurant.nearest_mrt);
          const lineColor = station ? MRT_LINE_COLORS[station.line as MrtLine] : undefined;
          return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-base flex-shrink-0">🚇</span>
              <span className="flex items-center gap-1">
                {lineColor && (
                  <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lineColor }} />
                )}
                Near {restaurant.nearest_mrt}
              </span>
            </div>
          );
        })()}

        {restaurant.vegetarian_types.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {restaurant.vegetarian_types.map((type) => (
              <VegTypeBadge key={type} type={type} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Desktop: floating preview card over map */
function DesktopPreviewCard({
  restaurant,
  onClose,
  userLocation,
}: {
  restaurant: Restaurant;
  onClose: () => void;
  userLocation: { lat: number; lng: number } | null;
}) {
  const distance =
    userLocation && restaurant.location
      ? getDistanceKm(userLocation, restaurant.location)
      : null;

  const googleMapsUrl = restaurant.location
    ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.location.lat},${restaurant.location.lng}`
    : null;

  return (
    <div className="absolute bottom-4 left-4 w-[360px] z-10 animate-in slide-in-from-bottom-4 duration-200">
      <div className="bg-background rounded-xl shadow-lg border overflow-hidden">
        <div className="flex">
          <div className="relative w-24 h-24 flex-shrink-0">
            {restaurant.cover_image_url ? (
              <Image
                src={restaurant.cover_image_url}
                alt={restaurant.name_en}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-2xl">
                🌱
              </div>
            )}
          </div>
          <div className="flex-1 p-3 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <h3 className="font-semibold text-sm truncate">{restaurant.name_en}</h3>
              <button
                onClick={onClose}
                className="p-2 -mr-1 -mt-1 rounded-full hover:bg-muted flex-shrink-0 cursor-pointer"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            {restaurant.name_zh && (
              <p className="text-xs text-muted-foreground truncate">{restaurant.name_zh}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              {restaurant.avg_rating > 0 ? (
                <div className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{restaurant.avg_rating}</span>
                  <span className="text-xs text-muted-foreground">({restaurant.review_count})</span>
                </div>
              ) : restaurant.google_rating ? (
                <div className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{restaurant.google_rating}</span>
                  <span className="text-[10px] text-muted-foreground">Google</span>
                </div>
              ) : null}
              {distance !== null && (
                <span className="text-xs text-muted-foreground">
                  {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
                </span>
              )}
              {restaurant.price_range && (
                <span className="text-xs text-muted-foreground">{restaurant.price_range}</span>
              )}
            </div>
            <div className="flex gap-1 mt-1">
              {restaurant.vegetarian_types.slice(0, 2).map((type) => (
                <VegTypeBadge key={type} type={type} size="sm" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex border-t">
          <Link
            href={`/restaurants/${restaurant.slug}`}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            View Details <ChevronRight className="h-4 w-4" />
          </Link>
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 px-4 py-2.5 text-sm border-l hover:bg-muted transition-colors"
            >
              <Navigation className="h-4 w-4" /> Navigate
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/** Compact restaurant row for mobile bottom sheet — memoized for scroll perf */
const CompactRestaurantItem = memo(function CompactRestaurantItem({ restaurant }: { restaurant: Restaurant }) {
  const station = restaurant.nearest_mrt
    ? MRT_STATIONS.find(s => s.name_en === restaurant.nearest_mrt)
    : null;
  const lineColor = station ? MRT_LINE_COLORS[station.line as MrtLine] : undefined;

  return (
    <Link
      href={`/restaurants/${restaurant.slug}`}
      className="flex gap-3 p-3 border-b hover:bg-muted/50 transition-colors"
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
        {restaurant.cover_image_url ? (
          /* Native img for scroll performance — avoids next/image hydration cost */
          <img
            src={restaurant.cover_image_url}
            alt={restaurant.name_en}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
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
          {restaurant.avg_rating > 0 ? (
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{restaurant.avg_rating}</span>
              <span className="text-xs text-muted-foreground">({restaurant.review_count})</span>
            </div>
          ) : restaurant.google_rating ? (
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{restaurant.google_rating}</span>
              <span className="text-[10px] text-muted-foreground">Google</span>
            </div>
          ) : null}
          {restaurant.nearest_mrt ? (
            <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
              {lineColor && (
                <span className="inline-block w-2 h-2 rounded-full mr-0.5" style={{ backgroundColor: lineColor }} />
              )}
              {restaurant.nearest_mrt}
            </div>
          ) : restaurant.district ? (
            <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {restaurant.district}
            </div>
          ) : null}
          {restaurant.price_range && (
            <span className="text-xs text-muted-foreground">{restaurant.price_range}</span>
          )}
        </div>
      </div>
    </Link>
  );
});
