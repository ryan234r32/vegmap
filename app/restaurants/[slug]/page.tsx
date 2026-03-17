import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { RestaurantDetail } from "./restaurant-detail";
import { RestaurantJsonLd } from "@/components/restaurant/json-ld";
import { parseWkbPoint } from "@/lib/geo";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name_en, description_en, district, vegetarian_types, cover_image_url")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!restaurant) return { title: "Restaurant Not Found" };

  const vegTypes = (restaurant.vegetarian_types as string[])?.join(", ") ?? "";
  const desc =
    restaurant.description_en ??
    `${restaurant.name_en} - ${vegTypes} restaurant in ${restaurant.district ?? "Taipei"}. Find English menu, reviews, and directions.`;

  return {
    title: restaurant.name_en,
    description: desc,
    alternates: {
      canonical: `/restaurants/${slug}`,
    },
    openGraph: {
      title: `${restaurant.name_en} | VegMap`,
      description: desc,
      ...(restaurant.cover_image_url && {
        images: [{ url: restaurant.cover_image_url, width: 800, height: 600 }],
      }),
    },
  };
}

export default async function RestaurantPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!restaurant) notFound();

  // Transform PostGIS WKB location to {lat, lng}
  restaurant.location = parseWkbPoint(restaurant.location as unknown as string);

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profile:profiles(*), photos:review_photos(*)")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: menus } = await supabase
    .from("menus")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false });

  // Aggregate photos from reviews for the Photos tab
  const photos: { id: string; url: string }[] = [];
  if (reviews) {
    for (const review of reviews) {
      const reviewPhotos = (review as Record<string, unknown>).photos as
        | { id: string; storage_path: string }[]
        | undefined;
      if (reviewPhotos) {
        for (const p of reviewPhotos) {
          photos.push({ id: p.id, url: p.storage_path });
        }
      }
    }
  }

  return (
    <>
      <RestaurantJsonLd restaurant={restaurant} />
      <RestaurantDetail
        restaurant={restaurant}
        reviews={reviews ?? []}
        menus={menus ?? []}
        photos={photos}
      />
    </>
  );
}
