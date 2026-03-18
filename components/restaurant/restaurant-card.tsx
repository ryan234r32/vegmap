"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { VegTypeBadge } from "./veg-type-badge";
import { TrustBadge } from "./trust-badge";
import { Star, MapPin, Heart, Train } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { MRT_STATIONS, MRT_LINE_COLORS } from "@/constants";
import type { Restaurant } from "@/lib/types";
import type { MrtLine } from "@/constants";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onFavoriteNeedAuth?: () => void;
  distance?: number; // km from user
}

export function RestaurantCard({ restaurant, onFavoriteNeedAuth, distance }: RestaurantCardProps) {
  const { user } = useAuth();
  const { isFavorited, toggle } = useFavorites();
  const favorited = isFavorited(restaurant.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    if (!user) {
      onFavoriteNeedAuth?.();
      return;
    }
    toggle(restaurant.id);
  };

  return (
    <Link href={`/restaurants/${restaurant.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        {/* Cover Image */}
        <div className="relative aspect-[4/3] bg-muted">
          {restaurant.cover_image_url ? (
            <Image
              src={restaurant.cover_image_url}
              alt={restaurant.name_en || "Restaurant"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              🥬
            </div>
          )}
          {/* Price Range */}
          {restaurant.price_range && (
            <span className="absolute top-2 left-2 bg-background/90 text-foreground text-xs font-medium px-2 py-1 rounded">
              {restaurant.price_range}
            </span>
          )}
          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                favorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`}
            />
          </button>
        </div>

        <CardContent className="p-4">
          {/* Name */}
          <h3 className="font-semibold text-lg leading-tight mb-1">
            {restaurant.name_en}
          </h3>
          {restaurant.name_zh && (
            <p className="text-sm text-muted-foreground mb-2">
              {restaurant.name_zh}
            </p>
          )}

          {/* Rating — show VegMap rating if available, otherwise Google rating */}
          <div className="flex items-center gap-2 mb-2">
            {restaurant.avg_rating > 0 ? (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">
                  {restaurant.avg_rating}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({restaurant.review_count})
                </span>
              </div>
            ) : restaurant.google_rating ? (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">
                  {restaurant.google_rating}
                </span>
                <span className="text-xs text-muted-foreground">Google</span>
              </div>
            ) : null}
          </div>

          {/* Location: Distance + District + Nearest MRT */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 flex-wrap">
            {distance !== undefined && (
              <span className="flex items-center gap-1 font-medium text-foreground">
                <MapPin className="h-3 w-3" />
                {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
              </span>
            )}
            {!distance && restaurant.district && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {restaurant.district}
              </span>
            )}
            {restaurant.nearest_mrt && (() => {
              const station = MRT_STATIONS.find(s => s.name_en === restaurant.nearest_mrt);
              const lineColor = station ? MRT_LINE_COLORS[station.line as MrtLine] : undefined;
              return (
                <span className="flex items-center gap-1">
                  <Train className="h-3 w-3" />
                  {lineColor && (
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: lineColor }} />
                  )}
                  {restaurant.nearest_mrt}
                </span>
              );
            })()}
          </div>

          {/* Veg Types + Trust Badge */}
          <div className="flex flex-wrap gap-1 items-center">
            {restaurant.vegetarian_types.map((type) => (
              <VegTypeBadge key={type} type={type} />
            ))}
            <TrustBadge isVerified={restaurant.is_verified} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
