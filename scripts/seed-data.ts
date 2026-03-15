/**
 * Seed data script for VegMap demo.
 * Run: npx tsx scripts/seed-data.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SEED_RESTAURANTS = [
  {
    name_en: "Ooh Cha Cha",
    name_zh: "自然醒",
    slug: "ooh-cha-cha",
    description_en:
      "Popular plant-based cafe in Da'an serving creative vegan dishes, smoothie bowls, and specialty coffee. Fully English menu available.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Western", "Taiwanese"],
    price_range: "$$",
    address_en: "No. 207, Section 1, Dunhua South Road, Da'an District",
    address_zh: "大安區敦化南路一段207號",
    city: "Taipei",
    district: "Da'an",
    location: "POINT(121.5491 25.0388)",
    google_rating: 4.5,
    avg_rating: 4.5,
    review_count: 12,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "About Animals",
    name_zh: "關於動物",
    slug: "about-animals",
    description_en:
      "Trendy vegan restaurant in Zhongshan offering creative Asian fusion dishes. Known for their mushroom-based main courses and beautiful plating.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Chinese", "Japanese"],
    price_range: "$$$",
    address_en: "No. 15, Lane 252, Nanjing East Road Sec 3, Zhongshan District",
    address_zh: "中山區南京東路三段252巷15號",
    city: "Taipei",
    district: "Zhongshan",
    location: "POINT(121.5441 25.0520)",
    google_rating: 4.3,
    avg_rating: 4.3,
    review_count: 8,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Herban Kitchen & Bar",
    name_zh: "草本廚房",
    slug: "herban-kitchen-bar",
    description_en:
      "Upscale vegan dining with cocktails in Xinyi. Features seasonal tasting menus and a la carte Western-style dishes. Full English service.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Western", "Italian"],
    price_range: "$$$",
    address_en: "No. 108, Section 4, Xinyi Road, Da'an District",
    address_zh: "大安區信義路四段108號",
    city: "Taipei",
    district: "Da'an",
    location: "POINT(121.5533 25.0331)",
    google_rating: 4.6,
    avg_rating: 4.7,
    review_count: 15,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Loving Hut Songshan",
    name_zh: "愛家國際餐飲松山店",
    slug: "loving-hut-songshan",
    description_en:
      "Part of the global Loving Hut chain. Affordable Taiwanese vegetarian buffet with a wide selection of hot dishes, soups, and desserts.",
    vegetarian_types: ["vegan", "five_spice"],
    cuisine_tags: ["Taiwanese", "Buffet"],
    price_range: "$",
    address_en: "No. 12, Lane 150, Section 5, Nanjing East Road, Songshan District",
    address_zh: "松山區南京東路五段150巷12號",
    city: "Taipei",
    district: "Songshan",
    location: "POINT(121.5624 25.0510)",
    google_rating: 4.0,
    avg_rating: 3.8,
    review_count: 6,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Green Kitchen",
    name_zh: "綠廚房",
    slug: "green-kitchen-daan",
    description_en:
      "Cozy vegetarian restaurant near Daan Park serving traditional Taiwanese vegetarian set meals. English picture menu available.",
    vegetarian_types: ["ovo_lacto", "vegetarian_friendly"],
    cuisine_tags: ["Taiwanese", "Rice Box"],
    price_range: "$",
    address_en: "No. 78, Yongkang Street, Da'an District",
    address_zh: "大安區永康街78號",
    city: "Taipei",
    district: "Da'an",
    location: "POINT(121.5298 25.0305)",
    google_rating: 4.2,
    avg_rating: 4.0,
    review_count: 4,
    is_verified: false,
    is_active: true,
  },
  {
    name_en: "Minder Vegetarian",
    name_zh: "明德素食園",
    slug: "minder-vegetarian",
    description_en:
      "Long-standing Buddhist vegetarian restaurant known for incredible mock meat dishes and traditional Chinese vegetarian cuisine. No garlic or onion.",
    vegetarian_types: ["vegan", "five_spice"],
    cuisine_tags: ["Chinese", "Dim Sum"],
    price_range: "$$",
    address_en: "No. 171, Section 2, Nanjing East Road, Zhongshan District",
    address_zh: "中山區南京東路二段171號",
    city: "Taipei",
    district: "Zhongshan",
    location: "POINT(121.5354 25.0524)",
    google_rating: 4.4,
    avg_rating: 4.2,
    review_count: 10,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Plants",
    name_zh: "Plants",
    slug: "plants-cafe",
    description_en:
      "Instagram-worthy vegan cafe specializing in acai bowls, salads, and plant-based burgers. Very popular with expats and tourists.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Western", "Fast Food"],
    price_range: "$$",
    address_en: "No. 32, Lane 49, Section 1, Zhongshan North Road, Zhongshan District",
    address_zh: "中山區中山北路一段49巷32號",
    city: "Taipei",
    district: "Zhongshan",
    location: "POINT(121.5228 25.0488)",
    google_rating: 4.3,
    avg_rating: 4.4,
    review_count: 9,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Veggie Creek",
    name_zh: "蔬河",
    slug: "veggie-creek",
    description_en:
      "Japanese-style vegetarian restaurant offering ramen, curry rice, and donburi. All dishes can be made vegan on request.",
    vegetarian_types: ["ovo_lacto", "vegan"],
    cuisine_tags: ["Japanese", "Noodles"],
    price_range: "$$",
    address_en: "No. 55, Section 2, Fuxing South Road, Da'an District",
    address_zh: "大安區復興南路二段55號",
    city: "Taipei",
    district: "Da'an",
    location: "POINT(121.5437 25.0268)",
    google_rating: 4.1,
    avg_rating: 4.1,
    review_count: 7,
    is_verified: false,
    is_active: true,
  },
  {
    name_en: "Sufood",
    name_zh: "舒果",
    slug: "sufood-xinyi",
    description_en:
      "Upscale vegetarian hot pot and set meal restaurant in the Xinyi shopping district. Popular for business dinners and special occasions.",
    vegetarian_types: ["ovo_lacto", "vegetarian_friendly"],
    cuisine_tags: ["Hot Pot", "Taiwanese"],
    price_range: "$$$",
    address_en: "No. 12, Songshou Road, Xinyi District",
    address_zh: "信義區松壽路12號",
    city: "Taipei",
    district: "Xinyi",
    location: "POINT(121.5676 25.0360)",
    google_rating: 4.0,
    avg_rating: 3.9,
    review_count: 5,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Whole Foods Vegan Bakery",
    name_zh: "全素烘培坊",
    slug: "whole-foods-vegan-bakery",
    description_en:
      "100% vegan bakery offering fresh bread, cakes, cookies, and pastries. All items are free from eggs, dairy, and honey.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Bakery", "Dessert"],
    price_range: "$",
    address_en: "No. 88, Section 1, Roosevelt Road, Zhongzheng District",
    address_zh: "中正區羅斯福路一段88號",
    city: "Taipei",
    district: "Zhongzheng",
    location: "POINT(121.5192 25.0285)",
    google_rating: 4.5,
    avg_rating: 4.6,
    review_count: 11,
    is_verified: true,
    is_active: true,
  },
];

async function seed() {
  console.log("Seeding restaurants...");

  for (const restaurant of SEED_RESTAURANTS) {
    const { error } = await supabase.from("restaurants").upsert(restaurant, {
      onConflict: "slug",
    });

    if (error) {
      console.error(`Failed to seed ${restaurant.name_en}:`, error.message);
    } else {
      console.log(`  ✓ ${restaurant.name_en}`);
    }
  }

  console.log(`\nDone! Seeded ${SEED_RESTAURANTS.length} restaurants.`);
}

seed().catch(console.error);
