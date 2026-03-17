"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, X, Navigation, ChevronRight } from "lucide-react";
import { VegTypeBadge } from "@/components/restaurant/veg-type-badge";
import type { Restaurant } from "@/lib/types";

interface PreviewCardProps {
  restaurant: Restaurant;
  onClose: () => void;
  userLocation?: { lat: number; lng: number } | null;
}

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

export function PreviewCard({ restaurant, onClose, userLocation }: PreviewCardProps) {
  const distance =
    userLocation && restaurant.location
      ? getDistanceKm(userLocation, restaurant.location)
      : null;

  const googleMapsUrl = restaurant.location
    ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.location.lat},${restaurant.location.lng}`
    : null;

  return (
    <div className="fixed bottom-[152px] left-3 right-3 z-[45] md:absolute md:bottom-4 md:left-4 md:right-auto md:w-[360px] md:z-10 animate-in slide-in-from-bottom-4 duration-200">
      <div className="bg-background rounded-xl shadow-lg border overflow-hidden">
        <div className="flex">
          {/* Image */}
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

          {/* Content */}
          <div className="flex-1 p-3 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <h3 className="font-semibold text-sm truncate">
                {restaurant.name_en}
              </h3>
              <button
                onClick={onClose}
                className="p-0.5 rounded-full hover:bg-muted flex-shrink-0 cursor-pointer"
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
              {restaurant.avg_rating > 0 && (
                <div className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">
                    {restaurant.avg_rating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({restaurant.review_count})
                  </span>
                </div>
              )}
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
              {restaurant.vegetarian_types.slice(0, 2).map((type) => (
                <VegTypeBadge key={type} type={type} size="sm" />
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex border-t">
          <Link
            href={`/restaurants/${restaurant.slug}`}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </Link>
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 px-4 py-2.5 text-sm border-l hover:bg-muted transition-colors"
            >
              <Navigation className="h-4 w-4" />
              Navigate
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
