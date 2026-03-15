import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { VegTypeBadge } from "./veg-type-badge";
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
        <div className="relative h-48 bg-muted">
          {restaurant.cover_image_url ? (
            <img
              src={restaurant.cover_image_url}
              alt={restaurant.name_en}
              className="w-full h-full object-cover"
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

          {/* Veg Types */}
          <div className="flex flex-wrap gap-1">
            {restaurant.vegetarian_types.map((type) => (
              <VegTypeBadge key={type} type={type} />
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
