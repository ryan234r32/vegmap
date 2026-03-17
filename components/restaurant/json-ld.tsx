import type { Restaurant } from "@/lib/types";

interface Props {
  restaurant: Restaurant;
}

export function RestaurantJsonLd({ restaurant }: Props) {
  // Build JSON-LD, filtering out undefined/null values to produce valid JSON
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name_en,
  };

  if (restaurant.name_zh) jsonLd.alternateName = restaurant.name_zh;
  if (restaurant.description_en) jsonLd.description = restaurant.description_en;

  jsonLd.address = {
    "@type": "PostalAddress",
    ...(restaurant.address_en && { streetAddress: restaurant.address_en }),
    addressLocality: restaurant.district ?? "Taipei",
    addressRegion: "Taipei",
    addressCountry: "TW",
  };

  if (restaurant.location) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: restaurant.location.lat,
      longitude: restaurant.location.lng,
    };
  }

  if (restaurant.phone) jsonLd.telephone = restaurant.phone;
  if (restaurant.website) jsonLd.url = restaurant.website;

  const cuisines = ["Vegetarian", ...(restaurant.cuisine_tags ?? [])];
  jsonLd.servesCuisine = cuisines;

  if (restaurant.price_range) jsonLd.priceRange = restaurant.price_range;

  if (restaurant.avg_rating > 0 && restaurant.review_count > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: restaurant.avg_rating,
      reviewCount: restaurant.review_count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (restaurant.cover_image_url) jsonLd.image = restaurant.cover_image_url;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
