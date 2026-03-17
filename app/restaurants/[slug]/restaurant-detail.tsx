"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { VegTypeBadge } from "@/components/restaurant/veg-type-badge";
import { StarRating } from "@/components/restaurant/star-rating";
import { ReviewCard } from "@/components/review/review-card";
import { ReviewForm } from "@/components/review/review-form";
import { MenuDisplay } from "@/components/menu/menu-display";
import { MenuUpload } from "@/components/menu/menu-upload";
import { PhotoGallery } from "@/components/restaurant/photo-gallery";
import { ReportIssueButton } from "@/components/restaurant/report-issue-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { createClient } from "@/lib/supabase/client";
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  ExternalLink,
  Heart,
  Share2,
  MessageSquare,
  Navigation,
  Camera,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DAYS_OF_WEEK, PRICE_RANGES } from "@/constants";
import type { Restaurant, Review, Menu, MenuItem } from "@/lib/types";

interface Props {
  restaurant: Restaurant;
  reviews: Review[];
  menus: Menu[];
  photos: { id: string; url: string }[];
}

function getTodayHours(
  openingHours: Record<string, { open: string; close: string } | null> | null
): { label: string; isOpen: boolean } | null {
  if (!openingHours || Object.keys(openingHours).length === 0) return null;
  const today = DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const hours = openingHours[today.toLowerCase()];
  if (!hours) return { label: "Closed today", isOpen: false };
  return { label: `Open ${hours.open} – ${hours.close}`, isOpen: true };
}

function getAverageDishPrice(menus: Menu[]): number | null {
  const prices: number[] = [];
  for (const menu of menus) {
    if (menu.items) {
      for (const item of menu.items as MenuItem[]) {
        if (item.price && item.price > 0) prices.push(item.price);
      }
    }
  }
  if (prices.length === 0) return null;
  return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
}

function getPriceLabel(priceRange: string): string | null {
  const found = PRICE_RANGES.find((p) => p.value === priceRange);
  return found ? found.label : null;
}

export function RestaurantDetail({
  restaurant,
  reviews: initialReviews,
  menus,
  photos,
}: Props) {
  const { user } = useAuth();
  const { isFavorited, toggle: toggleFavorite } = useFavorites();
  const [reviews, setReviews] = useState(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllHours, setShowAllHours] = useState(false);

  const handleReviewSuccess = async () => {
    setShowReviewForm(false);
    const supabase = createClient();
    const { data } = await supabase
      .from("reviews")
      .select("*, profile:profiles(*), photos:review_photos(*)")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setReviews(data);
  };

  const handleHelpful = async (reviewId: string) => {
    if (!user) return;
    const supabase = createClient();
    await supabase.from("helpful_votes").upsert({
      review_id: reviewId,
      user_id: user.id,
    });
    const { data } = await supabase
      .from("reviews")
      .select("*, profile:profiles(*), photos:review_photos(*)")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setReviews(data);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${restaurant.name_en} | VegMap`,
        text: `Check out ${restaurant.name_en} on VegMap!`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const openingHours = restaurant.opening_hours as Record<
    string,
    { open: string; close: string } | null
  > | null;

  const todayHours = getTodayHours(openingHours);
  const avgDishPrice = getAverageDishPrice(menus);
  const priceLabel = restaurant.price_range ? getPriceLabel(restaurant.price_range) : null;

  const directionsUrl = restaurant.location
    ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.location.lat},${restaurant.location.lng}`
    : restaurant.google_maps_url;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        {/* Cover Image — shorter on mobile */}
        <div className="relative h-36 sm:h-48 md:h-80 bg-muted">
          {restaurant.cover_image_url ? (
            <img
              src={restaurant.cover_image_url}
              alt={restaurant.name_en || "Restaurant"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 flex items-center justify-center">
              <span className="text-6xl md:text-8xl">🥬</span>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 py-4 md:py-6">
          {/* Title & Rating — compact on mobile */}
          <div className="flex items-start justify-between mb-2 md:mb-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-bold truncate">{restaurant.name_en}</h1>
              {restaurant.name_zh && (
                <p className="text-base md:text-lg text-muted-foreground truncate">
                  {restaurant.name_zh}
                </p>
              )}
            </div>
            {/* Desktop only: heart + share */}
            <div className="hidden md:flex gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFavorite(restaurant.id)}
              >
                <Heart
                  className={`h-4 w-4 ${isFavorited(restaurant.id) ? "fill-red-500 text-red-500" : ""}`}
                />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Rating + Price + Veg badges — single row */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {restaurant.avg_rating > 0 && (
              <div className="flex items-center gap-1">
                <StarRating rating={restaurant.avg_rating} size="sm" />
                <span className="text-sm font-semibold">{restaurant.avg_rating}</span>
                <span className="text-xs text-muted-foreground">({restaurant.review_count})</span>
              </div>
            )}
            {restaurant.price_range && (
              <Badge variant="secondary" className="text-xs">
                {restaurant.price_range}
                {avgDishPrice && <span className="ml-1">~NT${avgDishPrice}/dish</span>}
              </Badge>
            )}
            {restaurant.is_verified && (
              <Badge className="bg-green-600 text-xs">Verified</Badge>
            )}
          </div>

          {/* Veg types + cuisine tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {restaurant.vegetarian_types.map((type) => (
              <VegTypeBadge key={type} type={type} size="sm" />
            ))}
            {restaurant.cuisine_tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* ===== MOBILE ACTION BAR ===== */}
          <div className="md:hidden flex gap-2 mb-4">
            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate
                </Button>
              </a>
            )}
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`}>
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
              </a>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleFavorite(restaurant.id)}
            >
              <Heart
                className={`h-4 w-4 ${isFavorited(restaurant.id) ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
          </div>

          {/* ===== MOBILE KEY INFO (above tabs) ===== */}
          <div className="md:hidden space-y-2 mb-4 text-sm">
            {restaurant.address_en && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate">{restaurant.address_en}</p>
                  {restaurant.address_zh && (
                    <p className="text-muted-foreground truncate">{restaurant.address_zh}</p>
                  )}
                </div>
              </div>
            )}
            {todayHours && (
              <button
                className="flex items-center gap-2 w-full text-left cursor-pointer"
                onClick={() => setShowAllHours(!showAllHours)}
              >
                <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className={todayHours.isOpen ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                  {todayHours.label}
                </span>
                {showAllHours ? (
                  <ChevronUp className="h-3 w-3 text-muted-foreground ml-auto" />
                ) : (
                  <ChevronDown className="h-3 w-3 text-muted-foreground ml-auto" />
                )}
              </button>
            )}
            {showAllHours && openingHours && (
              <div className="ml-6 space-y-1 text-xs">
                {DAYS_OF_WEEK.map((day) => {
                  const hours = openingHours[day.toLowerCase()];
                  return (
                    <div key={day} className="flex justify-between">
                      <span className="text-muted-foreground">{day}</span>
                      <span>{hours ? `${hours.open} – ${hours.close}` : "Closed"}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {priceLabel && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">💰</span>
                <span>{priceLabel}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              {restaurant.description_en && (
                <>
                  <p className="text-muted-foreground text-sm md:text-base mb-4">
                    {restaurant.description_en}
                  </p>
                  <Separator className="mb-4 hidden md:block" />
                </>
              )}

              {/* Tabs — default to menu (user's #1 priority) */}
              <Tabs defaultValue="menu">
                <TabsList>
                  <TabsTrigger value="menu">
                    Menu {menus.length > 0 && `(${menus.length})`}
                  </TabsTrigger>
                  <TabsTrigger value="reviews">
                    Reviews {reviews.length > 0 && `(${reviews.length})`}
                  </TabsTrigger>
                  <TabsTrigger value="photos">
                    Photos {photos.length > 0 && `(${photos.length})`}
                  </TabsTrigger>
                </TabsList>

                {/* ===== MENU TAB ===== */}
                <TabsContent value="menu" className="mt-4">
                  {menus.length === 0 ? (
                    <div className="text-center py-10">
                      <Camera className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                      <h3 className="font-semibold mb-1">No menu available yet</h3>
                      <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
                        Snap a photo of the menu and our AI will translate it instantly!
                      </p>
                      {user ? (
                        <MenuUpload restaurantId={restaurant.id} />
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Sign in to upload a menu photo
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {menus.map((menu) => (
                        <MenuDisplay key={menu.id} menu={menu} />
                      ))}
                      {user && (
                        <div className="mt-6">
                          <MenuUpload restaurantId={restaurant.id} />
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                {/* ===== REVIEWS TAB ===== */}
                <TabsContent value="reviews" className="mt-4">
                  {user && !showReviewForm && (
                    <Button
                      onClick={() => setShowReviewForm(true)}
                      className="mb-4"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Write a Review
                    </Button>
                  )}

                  {showReviewForm && user && (
                    <div className="border rounded-lg p-4 mb-6">
                      <h3 className="font-semibold mb-4">Write Your Review</h3>
                      <ReviewForm
                        restaurantId={restaurant.id}
                        userId={user.id}
                        onSuccess={handleReviewSuccess}
                        onCancel={() => setShowReviewForm(false)}
                      />
                    </div>
                  )}

                  {reviews.length === 0 ? (
                    <div className="text-center py-10">
                      <MessageSquare className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                      <h3 className="font-semibold mb-1">No reviews yet</h3>
                      <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
                        Be the first to share your experience! Was the food good? Is it English-friendly?
                      </p>
                      {user ? (
                        <Button onClick={() => setShowReviewForm(true)} variant="outline">
                          Write a Review
                        </Button>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Sign in to write a review
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      {reviews.map((review) => (
                        <ReviewCard
                          key={review.id}
                          review={review}
                          onHelpful={handleHelpful}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* ===== PHOTOS TAB ===== */}
                <TabsContent value="photos" className="mt-4">
                  <PhotoGallery
                    restaurantId={restaurant.id}
                    photos={photos}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* ===== DESKTOP SIDEBAR (hidden on mobile) ===== */}
            <div className="hidden lg:block space-y-6">
              {/* Info Card */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Restaurant Info</h3>

                {restaurant.address_en && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                      <p>{restaurant.address_en}</p>
                      {restaurant.address_zh && (
                        <p className="text-muted-foreground">
                          {restaurant.address_zh}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {restaurant.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 shrink-0" />
                    <a
                      href={`tel:${restaurant.phone}`}
                      className="hover:underline"
                    >
                      {restaurant.phone}
                    </a>
                  </div>
                )}

                {restaurant.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 shrink-0" />
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline truncate"
                    >
                      Website
                      <ExternalLink className="h-3 w-3 inline ml-1" />
                    </a>
                  </div>
                )}

                {directionsUrl && (
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="sm">
                      <Navigation className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                  </a>
                )}

                {restaurant.google_maps_url && (
                  <a
                    href={restaurant.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full" size="sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      Open in Google Maps
                    </Button>
                  </a>
                )}

                {restaurant.google_rating && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Google Rating: {restaurant.google_rating}/5</span>
                  </div>
                )}

                {priceLabel && (
                  <div className="text-sm text-muted-foreground">
                    {priceLabel}
                    {avgDishPrice && ` · Avg NT$${avgDishPrice}/dish`}
                  </div>
                )}
              </div>

              {/* Opening Hours */}
              {openingHours && Object.keys(openingHours).length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Opening Hours
                  </h3>
                  <div className="space-y-1.5 text-sm">
                    {DAYS_OF_WEEK.map((day) => {
                      const hours = openingHours[day.toLowerCase()];
                      return (
                        <div key={day} className="flex justify-between">
                          <span className="text-muted-foreground">{day}</span>
                          <span>
                            {hours ? `${hours.open} – ${hours.close}` : "Closed"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Report Issue + Diet Card */}
              <div className="space-y-3">
                <ReportIssueButton restaurantId={restaurant.id} />
                <a
                  href="/tools/diet-card"
                  className="block text-center text-sm text-green-700 hover:text-green-800 underline"
                >
                  Get your Diet Communication Card
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Report Issue - below tabs */}
        <div className="md:hidden container mx-auto px-4 pb-4 space-y-3">
          <ReportIssueButton restaurantId={restaurant.id} />
        </div>
      </main>

      <Footer />

      {/* ===== MOBILE FIXED BOTTOM BAR ===== */}
      {directionsUrl && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background border-t px-4 py-3 safe-area-bottom">
          <div className="flex gap-2">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Navigation className="h-4 w-4 mr-2" />
                Directions
              </Button>
            </a>
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`}>
                <Button variant="outline" className="px-4">
                  <Phone className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
