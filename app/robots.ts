import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vegmap.tw";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/profile/", "/auth/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
