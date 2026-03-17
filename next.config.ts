import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://lh3.googleusercontent.com/**"),
    ],
    unoptimized: true,
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Permissions-Policy",
          value: "geolocation=(self)",
        },
      ],
    },
  ],
};

export default nextConfig;
