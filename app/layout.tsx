import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VegMap - Vegetarian Restaurants in Taipei",
    template: "%s | VegMap",
  },
  description:
    "Find vegetarian and vegan restaurants in Taipei with English menus, reviews, and AI-translated menu items. The ultimate guide for foreigners eating plant-based in Taiwan.",
  keywords: [
    "vegetarian restaurants Taipei",
    "vegan food Taiwan",
    "English menu vegetarian Taipei",
    "plant-based restaurants Taiwan",
    "vegmap",
  ],
  alternates: {
    canonical: "https://vegmap-nu.vercel.app",
  },
  openGraph: {
    title: "VegMap - Vegetarian Restaurants in Taipei",
    description:
      "Find vegetarian and vegan restaurants in Taipei with English menus and reviews.",
    type: "website",
    locale: "en_US",
    siteName: "VegMap",
  },
  twitter: {
    card: "summary_large_image",
    title: "VegMap - Vegetarian Restaurants in Taipei",
    description:
      "Find vegetarian and vegan restaurants in Taipei with English menus and reviews.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VegMap",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
      </body>
    </html>
  );
}
