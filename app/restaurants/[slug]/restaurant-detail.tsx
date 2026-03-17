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
} from "lucide-react";
import { DAYS_OF_WEEK } from "@/constants";
import type { Restaurant, Review, Menu } from "@/lib/types";

interface Props {
  restaurant: Restaurant;
  reviews: Review[];
  menus: Menu[];
}

export function RestaurantDetail({
  restaurant,
  reviews: initialReviews,
  menus,
}: Props) {
  const { user } = useAuth();
  const { isFavorited, toggle: toggleFavorite } = useFavorites();
  const [reviews, setReviews] = useState(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);

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
    // Re-fetch reviews
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Cover Image */}
        <div className="relative h-48 sm:h-64 md:h-80 bg-muted">
          {restaurant.cover_image_url ? (
            <img
              src={restaurant.cover_image_url}
              alt={restaurant.name_en || "Restaurant"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 flex items-center justify-center">
              <span className="text-8xl">🥬</span>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title & Actions */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{restaurant.name_en}</h1>
                  {restaurant.name_zh && (
                    <p className="text-lg text-muted-foreground">
                      {restaurant.name_zh}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
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

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                {restaurant.avg_rating > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={restaurant.avg_rating} size="md" />
                    <span className="font-semibold">
                      {restaurant.avg_rating}
                    </span>
                    <span className="text-muted-foreground">
                      ({restaurant.review_count} reviews)
                    </span>
                  </div>
                )}
                {restaurant.price_range && (
                  <Badge variant="secondary">{restaurant.price_range}</Badge>
                )}
                {restaurant.is_verified && (
                  <Badge className="bg-green-600">Verified</Badge>
                )}
              </div>

              {/* Veg Types */}
              <div className="flex flex-wrap gap-2 mb-4">
                {restaurant.vegetarian_types.map((type) => (
                  <VegTypeBadge key={type} type={type} size="md" />
                ))}
                {restaurant.cuisine_tags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Description */}
              {restaurant.description_en && (
                <p className="text-muted-foreground mb-6">
                  {restaurant.description_en}
                </p>
              )}

              <Separator className="my-6" />

              {/* Tabs: Reviews & Menu */}
              <Tabs defaultValue="reviews">
                <TabsList>
                  <TabsTrigger value="reviews">
                    Reviews ({reviews.length})
                  </TabsTrigger>
                  <TabsTrigger value="menu">
                    Menu ({menus.length})
                  </TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                </TabsList>

                <TabsContent value="reviews" className="mt-4">
                  {/* Write Review Button */}
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
                    <p className="text-muted-foreground py-8 text-center">
                      No reviews yet. Be the first to review!
                    </p>
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

                <TabsContent value="menu" className="mt-4">
                  {menus.length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center">
                      No menu uploaded yet. Help the community by uploading one!
                    </p>
                  ) : (
                    <div className="space-y-8">
                      {menus.map((menu) => (
                        <MenuDisplay key={menu.id} menu={menu} />
                      ))}
                    </div>
                  )}

                  {/* Menu Upload */}
                  {user && (
                    <div className="mt-6">
                      <MenuUpload restaurantId={restaurant.id} />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="photos" className="mt-4">
                  <PhotoGallery
                    restaurantId={restaurant.id}
                    photos={[]}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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
                        <div
                          key={day}
                          className="flex justify-between"
                        >
                          <span className="text-muted-foreground">{day}</span>
                          <span>
                            {hours
                              ? `${hours.open} - ${hours.close}`
                              : "Closed"}
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
      </main>
      <Footer />
    </div>
  );
}
