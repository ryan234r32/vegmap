import { createAdminClient } from "@/lib/supabase/admin";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vegmap.tw";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/restaurants`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const supabase = createAdminClient();
    const { data: restaurants } = await supabase
      .from("restaurants")
      .select("slug, updated_at")
      .eq("is_active", true)
      .limit(5000);

    const restaurantPages: MetadataRoute.Sitemap = (restaurants ?? []).map((r) => ({
      url: `${baseUrl}/restaurants/${r.slug}`,
      lastModified: new Date(r.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticPages, ...restaurantPages];
  } catch {
    return staticPages;
  }
}
