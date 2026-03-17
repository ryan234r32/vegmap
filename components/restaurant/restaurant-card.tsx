import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { VegTypeBadge } from "./veg-type-badge";
import { TrustBadge } from "./trust-badge";
import { Star, MapPin } from "lucide-react";
import type { Restaurant } from "@/lib/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
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
            <span className="absolute top-2 right-2 bg-background/90 text-foreground text-xs font-medium px-2 py-1 rounded">
              {restaurant.price_range}
            </span>
          )}
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

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            {restaurant.avg_rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">
                  {restaurant.avg_rating}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({restaurant.review_count})
                </span>
              </div>
            )}
            {restaurant.google_rating && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>Google: {restaurant.google_rating}</span>
              </div>
            )}
          </div>

          {/* District */}
          {restaurant.district && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
              <MapPin className="h-3 w-3" />
              <span>{restaurant.district}</span>
            </div>
          )}

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
