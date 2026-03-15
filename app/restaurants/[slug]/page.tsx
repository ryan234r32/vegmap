import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { RestaurantDetail } from "./restaurant-detail";
import { RestaurantJsonLd } from "@/components/restaurant/json-ld";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name_en, description_en, district, vegetarian_types")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!restaurant) return { title: "Restaurant Not Found" };

  const vegTypes = (restaurant.vegetarian_types as string[])?.join(", ") ?? "";

  return {
    title: restaurant.name_en,
    description:
      restaurant.description_en ??
      `${restaurant.name_en} - ${vegTypes} restaurant in ${restaurant.district ?? "Taipei"}. Find English menu, reviews, and directions.`,
    openGraph: {
      title: `${restaurant.name_en} | VegMap`,
      description:
        restaurant.description_en ??
        `Vegetarian restaurant in ${restaurant.district ?? "Taipei"}`,
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

  return (
    <>
      <RestaurantJsonLd restaurant={restaurant} />
      <RestaurantDetail
        restaurant={restaurant}
        reviews={reviews ?? []}
        menus={menus ?? []}
      />
    </>
  );
}
