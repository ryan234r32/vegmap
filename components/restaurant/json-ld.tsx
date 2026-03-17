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

  const vegCuisines: string[] = [];
  const types = restaurant.vegetarian_types ?? [];
  if (types.includes("vegan")) vegCuisines.push("Vegan");
  if (types.some((t) => ["ovo_lacto", "lacto", "ovo", "five_spice"].includes(t))) vegCuisines.push("Vegetarian");
  if (types.includes("vegetarian_friendly") && vegCuisines.length === 0) vegCuisines.push("Vegetarian-Friendly");
  if (vegCuisines.length === 0) vegCuisines.push("Vegetarian");
  const cuisines = [...vegCuisines, ...(restaurant.cuisine_tags ?? [])];
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
