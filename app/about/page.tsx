import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About VegMap",
  description:
    "VegMap helps foreigners find vegetarian restaurants in Taipei with English menus, reviews, and AI-translated menu items.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">About VegMap</h1>

        <div className="prose prose-lg dark:prose-invert">
          <p>
            <strong>VegMap</strong> was created for foreigners living in or
            visiting Taiwan who follow a vegetarian or vegan diet. Finding
            plant-based food in Taipei is surprisingly easy &mdash; Taiwan has
            one of the highest densities of vegetarian restaurants in the world
            &mdash; but navigating menus written entirely in Chinese can be
            challenging.
          </p>

          <h2>What We Offer</h2>
          <ul>
            <li>
              <strong>Interactive Map</strong> &mdash; See all vegetarian
              restaurants in Taipei on a map, with filters for vegan, ovo-lacto,
              five allium free, and more.
            </li>
            <li>
              <strong>English Reviews</strong> &mdash; Real reviews from the
              international community, including an &ldquo;English
              Friendly&rdquo; rating.
            </li>
            <li>
              <strong>AI-Translated Menus</strong> &mdash; Upload a photo of a
              Chinese menu and our AI will translate it to natural English,
              complete with allergen tags and vegan indicators.
            </li>
            <li>
              <strong>Community Corrections</strong> &mdash; AI translations are
              refined by the community to ensure accuracy.
            </li>
          </ul>

          <h2>Vegetarian Types in Taiwan</h2>
          <p>
            Taiwan recognizes several categories of vegetarian food, regulated by
            law:
          </p>
          <ul>
            <li>
              <strong>Vegan (全素/純素)</strong> &mdash; No animal products at
              all
            </li>
            <li>
              <strong>Ovo-Lacto (蛋奶素)</strong> &mdash; Includes eggs and
              dairy
            </li>
            <li>
              <strong>Lacto (奶素)</strong> &mdash; Includes dairy but not eggs
            </li>
            <li>
              <strong>Ovo (蛋素)</strong> &mdash; Includes eggs but not dairy
            </li>
            <li>
              <strong>Five Allium Free (五辛素)</strong> &mdash; Excludes garlic,
              onion, leek, scallion, and chives (Buddhist vegetarian)
            </li>
          </ul>

          <h2>Contribute</h2>
          <p>
            VegMap is powered by the community. You can help by writing reviews,
            uploading menu photos, and suggesting corrections to AI
            translations. Every contribution helps fellow vegetarians navigate
            Taipei&apos;s amazing food scene.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
