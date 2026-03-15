import type { Restaurant } from "@/lib/types";

interface Props {
  restaurant: Restaurant;
}

export function RestaurantJsonLd({ restaurant }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name_en,
    alternateName: restaurant.name_zh,
    description: restaurant.description_en,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address_en,
      addressLocality: restaurant.district ?? "Taipei",
      addressRegion: "Taipei",
      addressCountry: "TW",
    },
    geo: restaurant.location
      ? {
          "@type": "GeoCoordinates",
          latitude: restaurant.location.lat,
          longitude: restaurant.location.lng,
        }
      : undefined,
    telephone: restaurant.phone,
    url: restaurant.website,
    servesCuisine: ["Vegetarian", ...restaurant.cuisine_tags],
    priceRange: restaurant.price_range,
    aggregateRating:
      restaurant.avg_rating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: restaurant.avg_rating,
            reviewCount: restaurant.review_count,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    image: restaurant.cover_image_url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
