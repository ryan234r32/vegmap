/**
 * Seed data script for VegMap - REAL restaurant data.
 * Run: npx tsx scripts/seed-data.ts
 *
 * Contains REAL vegetarian/vegan restaurants in Taipei,
 * verified from multiple sources (Michelin Guide Taiwan, TripAdvisor,
 * HappyCow, Yelp, Google Maps, ifoodie.tw, taiwanobsessed.com, etc.)
 *
 * Covers all 12 Taipei districts: Da'an, Zhongshan, Xinyi, Zhongzheng,
 * Songshan, Wanhua, Datong, Shilin, Beitou, Neihu, Nangang, Wenshan.
 *
 * Last verified: 2026-03-16
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
  // ============================================================
  // DA'AN DISTRICT (大安區) — 18 restaurants
  // ============================================================
  {
    name_en: "Little Tree Food (Da'an Road)",
    name_zh: "小小樹食 大安店",
    slug: "little-tree-food-daan",
    description_en:
      "Michelin Bib Gourmand vegetarian bistro blending Sichuan and Western cuisines. Known for spicy tofu dumplings, gochujang-glazed cauliflower, and Thai-style burning bowls. Partners with small farmers using natural farming methods. No processed products or disposable cutlery.",
    vegetarian_types: ["vegan", "ovo_lacto"],
    cuisine_tags: ["Western", "Taiwanese", "Chinese"],
    price_range: "$$",
    address_en: "No. 17, Lane 116, Section 1, Da'an Road, Da'an District",
    address_zh: "大安區大安路一段116巷17號",
    city: "Taipei",
    district: "Da'an",
    phone: "+886-2-2778-2277",
    website: "https://www.littletreefood.com",
    location: "POINT(121.5468 25.0396)",
    google_rating: 4.4,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Little Tree Food (Dunnan)",
    name_zh: "小小樹食 敦南店",
    slug: "little-tree-food-dunnan",
    description_en:
      "Second branch of the Michelin Bib Gourmand vegetarian bistro on tree-lined Dunhua South Road. Same innovative fusion menu with eclectic pastas, pizzas, and Asian-Western crossover dishes in a stylish setting.",
    vegetarian_types: ["vegan", "ovo_lacto"],
    cuisine_tags: ["Western", "Taiwanese", "Chinese"],
    price_range: "$$",
    address_en: "No. 39-1, Section 2, Dunhua South Road, Da'an District",
    address_zh: "大安區敦化南路二段39-1號",
    city: "Taipei",
    district: "Da'an",
    phone: "+886-2-2700-0313",
    website: "https://www.littletreefood.com",
    location: "POINT(121.5487 25.0283)",
    google_rating: 4.3,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Plants",
    name_zh: "Plants",
    slug: "plants-daan",
    description_en:
      "Trendy vegan and gluten-free cafe established in 2016. Known for Instagram-worthy acai bowls, energy bowls, smoothies, and raw desserts. American-style fare with emphasis on organic, health-conscious whole-food ingredients. Very popular with expats.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Western", "Brunch"],
    price_range: "$$",
    address_en:
      "No. 10, Lane 253, Section 1, Fuxing South Road, Da'an District",
    address_zh: "大安區復興南路一段253巷10號",
    city: "Taipei",
    district: "Da'an",
    phone: "+886-2-2784-5677",
    website: "https://www.plantseatery.com.tw",
    location: "POINT(121.5437 25.0329)",
    google_rating: 4.5,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Ooh Cha Cha (Technology Building)",
    name_zh: "Ooh Cha Cha 自然食 科技大樓店",
    slug: "ooh-cha-cha-tech",
    description_en:
      "All-vegan restaurant started by Californian and Taiwanese friends. Serves creative plant-based burgers, sandwiches, bowls, smoothies, and freshly baked desserts. Sustainability-focused with an eco-conscious community vibe. Full English menu.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Western", "Brunch"],
    price_range: "$$",
    address_en:
      "No. 4-1, Lane 118, Section 2, Heping East Road, Da'an District",
    address_zh: "大安區和平東路二段118巷4號之1",
    city: "Taipei",
    district: "Da'an",
    phone: "+886-2-2737-2994",
    website: "https://www.oohchacha.com",
    location: "POINT(121.5428 25.0240)",
    google_rating: 4.4,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Mianto",
    name_zh: "艾果豐",
    slug: "mianto",
    description_en:
      "Fully vegan restaurant near Daan Park serving creative international cuisine without eggs, dairy, honey, or five-spice vegetables. Known for outstanding mushroom spaghetti and Western-Asian fusion dishes in a cozy, intimate setting.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Western", "Italian"],
    price_range: "$$",
    address_en:
      "1F, No. 6, Alley 26, Lane 123, Section 3, Ren'ai Road, Da'an District",
    address_zh: "大安區仁愛路三段123巷26弄6號1樓",
    city: "Taipei",
    district: "Da'an",
    phone: "+886-2-2711-8473",
    website: "https://www.mianto.com.tw",
    location: "POINT(121.5420 25.0374)",
    google_rating: 4.2,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Herban Kitchen & Bar",
    name_zh: "二本餐廳",
    slug: "herban-kitchen-bar",
    description_en:
      "Western-style vegetarian oasis in Taipei's East District offering creative plant-based dishes alongside cocktails, craft beer, and specialty coffee. Green-filled decor with lush foliage. Popular with expats for English-friendly service.",
    vegetarian_types: ["ovo_lacto", "vegetarian_friendly"],
    cuisine_tags: ["Western", "Brunch"],
    price_range: "$$",
    address_en:
      "No. 27, Lane 101, Section 4, Zhongxiao East Road, Da'an District",
    address_zh: "大安區忠孝東路四段101巷27號",
    city: "Taipei",
    district: "Da'an",
    phone: "+886-2-8773-7033",
    website: "https://www.herban.tw",
    location: "POINT(121.5491 25.0417)",
    google_rating: 4.4,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "DeliSoys",
    name_zh: "上善豆家",
    slug: "delisoys",
    description_en:
      "Tofu-themed Chinese vegetarian restaurant specializing in handmade soy dishes from organic soybeans. Famous for fresh soymilk, silky tofu preparations, pan-fried dumplings, and clay pot dishes. About 60% of the menu is vegan.",
    vegetarian_types: ["ovo_lacto", "vegan"],
    cuisine_tags: ["Taiwanese", "Chinese"],
    price_range: "$$",
    address_en:
      "No. 16, Lane 107, Section 1, Fuxing South Road, Da'an District",
    address_zh: "大安區復興南路一段107巷16號",
    city: "Taipei",
    district: "Da'an",
    phone: "+886-2-2731-6991",
    location: "POINT(121.5445 25.0368)",
    google_rating: 4.3,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "foldie",
    name_zh: "foldie 蔬食餐酒館",
    slug: "foldie",
    description_en:
      "Innovative vegan bistro and wine bar near Zhongxiao Dunhua MRT. Known for visually stunning dishes with intricate flavors that challenge preconceptions about vegetarian food. Signature truffle stinky tofu is a must-try.",
    vegetarian_types: ["ovo_lacto", "vegan"],
    cuisine_tags: ["Taiwanese", "Western"],
    price_range: "$$$",
    address_en:
      "1F, No. 11, Alley 7, Lane 205, Section 4, Zhongxiao East Road, Da'an District",
    address_zh: "大安區忠孝東路四段205巷7弄11號1樓",
    city: "Taipei",
    district: "Da'an",
    phone: "+886-2-8773-6020",
    location: "POINT(121.5520 25.0416)",
    google_rating: 4.5,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "MiaCucina (Fuxing)",
    name_zh: "MiaCucina 復興店",
    slug: "miacucina-fuxing",
    description_en:
      "Popular Italian-inspired vegetarian restaurant chain near Zhongxiao Fuxing MRT Exit 5. Extensive menu of handmade pasta, wood-fired pizza, risotto, salads, and Mexican-influenced dishes. Weekend brunch available from 9AM.",
    vegetarian_types: ["ovo_lacto", "vegetarian_friendly"],
    cuisine_tags: ["Italian", "Western", "Brunch"],
    price_range: "$$",
    address_en:
      "No. 11, Lane 107, Section 1, Fuxing South Road, Da'an District",
    address_zh: "大安區復興南路一段107巷11號",
    city: "Taipei",
    district: "Da'an",
    phone: "+886-2-2752-8767",
    location: "POINT(121.5439 25.0369)",
    google_rating: 4.1,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Spring Natural Vegetarian (Da'an)",
    name_zh: "春天素食 大安店",
    slug: "spring-natural-daan",
    description_en:
      "Upscale vegetarian buffet restaurant offering a lavish spread of vegetables, soups, salads, dim sum, fruits, and desserts. Long-standing favorite for family gatherings and celebrations. Near Guting MRT Exit 5.",
    vegetarian_types: ["ovo_lacto", "vegetarian_friendly"],
    cuisine_tags: ["Taiwanese", "Chinese", "Buffet"],
    price_range: "$$$",
    address_en: "3F, No. 177, Section 1, Heping East Road, Da'an District",
    address_zh: "大安區和平東路一段177號3樓",
    city: "Taipei",
    district: "Da'an",
    phone: "+886-2-2393-0288",
    website: "http://www.springfood.com.tw",
    location: "POINT(121.5300 25.0266)",
    google_rating: 3.9,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Vege Creek",
    name_zh: "蔬河",
    slug: "vege-creek-daan",
    description_en:
      "Japanese-style vegan noodle bar on Yanji Street. Build your own bowl from fresh vegetables, mushrooms, tofu, and noodles in rich umami-packed broths. Multiple branches across Taipei including Taipei 101 food court.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Japanese", "Noodles"],
    price_range: "$",
    address_en: "No. 2, Lane 129, Yanji Street, Da'an District",
    address_zh: "大安區延吉街129巷2號",
    city: "Taipei",
    district: "Da'an",
    phone: "+886-2-2778-1967",
    location: "POINT(121.5531 25.0396)",
    google_rating: 4.2,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Guo Ran Hui (Da'an)",
    name_zh: "果然匯 忠孝店",
    slug: "guo-ran-hui-daan",
    description_en:
      "Multi-cuisine vegetarian buffet on the 12th floor of SOGO department store. Features Japanese, Chinese, Mediterranean, Mexican, and Western food stations plus an entire dessert corner. Always full -- reservations essential.",
    vegetarian_types: ["ovo_lacto", "vegetarian_friendly"],
    cuisine_tags: ["Buffet", "Taiwanese", "Japanese", "Western"],
    price_range: "$$",
    address_en:
      "12F, No. 200, Section 4, Zhongxiao East Road, Da'an District",
    address_zh: "大安區忠孝東路四段200號12樓",
    city: "Taipei",
    district: "Da'an",
    phone: "+886-2-2771-8832",
    website: "https://www.fruitfulfood.com.tw",
    location: "POINT(121.5490 25.0416)",
    google_rating: 4.1,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Soul R. Vegan Cafe",
    name_zh: "靈魂餐廳",
    slug: "soul-r-vegan-cafe",
    description_en:
      "Intimate all-vegan cafe near Zhongxiao Fuxing serving exquisitely presented Taiwanese fusion cuisine. Famous for creative pasta with Thai and Mexican sauces, and exceptional desserts including signature waffles.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Western", "Taiwanese", "Dessert"],
    price_range: "$$",
    address_en:
      "1F, No. 6, Alley 1, Lane 217, Section 3, Zhongxiao East Road, Da'an District",
    address_zh: "大安區忠孝東路三段217巷1弄6號1樓",
    city: "Taipei",
    district: "Da'an",
    phone: "+886-2-2771-1365",
    location: "POINT(121.5441 25.0416)",
    google_rating: 4.4,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Nice Cream",
    name_zh: "Nice Cream",
    slug: "nice-cream",
    description_en:
      "Taiwan's first plant-based gelato shop, run by a family making gelato in Italy since 1921. Seasonal vegan flavors like chocolate, soy milk, matcha, lemon, and black sesame. Also serves egg waffles topped with vegan ice cream.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Dessert"],
    price_range: "$",
    address_en:
      "No. 12, Lane 79, Section 2, Jianguo South Road, Da'an District",
    address_zh: "大安區建國南路二段79巷12號",
    city: "Taipei",
    district: "Da'an",
    phone: "+886-2-8771-7150",
    location: "POINT(121.5389 25.0322)",
    google_rating: 4.6,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "NUTTEA Nut Mylk Tea (Da'an)",
    name_zh: "NUTTEA 堅果奶茶 大安店",
    slug: "nuttea-daan",
    description_en:
      "Innovative dairy-free bubble tea shop near Da'an MRT station. All drinks crafted with house-made nut milks instead of dairy. Full menu of creamy bubble teas, fruit teas, coffees, and vegan snacks.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Dessert"],
    price_range: "$",
    address_en: "No. 11-1, Section 2, Fuxing South Road, Da'an District",
    address_zh: "大安區復興南路二段11-1號",
    city: "Taipei",
    district: "Da'an",
    website: "https://nuttea.net",
    location: "POINT(121.5434 25.0264)",
    google_rating: 4.3,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Loving Hut (Heping Branch)",
    name_zh: "愛家國際餐飲 和平店",
    slug: "loving-hut-heping",
    description_en:
      "Part of the global Loving Hut vegan chain. This Da'an branch specializes in vegan hot pots with house-made broths and a wide selection of affordable Taiwanese plant-based comfort food.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Taiwanese", "Hot Pot"],
    price_range: "$",
    address_en:
      "No. 7, Lane 175, Section 2, Heping East Road, Da'an District",
    address_zh: "大安區和平東路二段175巷7號",
    city: "Taipei",
    district: "Da'an",
    location: "POINT(121.5409 25.0241)",
    google_rating: 4.0,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Easy House Vegetarian Cuisine",
    name_zh: "寬心園精緻蔬食料理",
    slug: "easy-house-daan",
    description_en:
      "Refined vegetarian restaurant near Anhe Road specializing in creative mushroom-based dishes, elegant set meals, and vegetarian hot pot. Suitable for business dinners and special occasions with sophisticated decor.",
    vegetarian_types: ["ovo_lacto", "vegetarian_friendly"],
    cuisine_tags: ["Taiwanese", "Chinese", "Hot Pot"],
    price_range: "$$",
    address_en:
      "No. 51, Alley 4, Lane 345, Section 4, Ren'ai Road, Da'an District",
    address_zh: "大安區仁愛路四段345巷4弄51號",
    city: "Taipei",
    district: "Da'an",
    location: "POINT(121.5530 25.0364)",
    google_rating: 4.0,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Flavour of India",
    name_zh: "印度風味",
    slug: "flavour-of-india",
    description_en:
      "Widely regarded as Taipei's best Indian restaurant for vegetarian food, near Technology Building MRT Exit 5. Extensive menu of authentic North and South Indian vegetarian dishes with many vegan options. Closed Mondays.",
    vegetarian_types: ["ovo_lacto", "vegan", "vegetarian_friendly"],
    cuisine_tags: ["Indian"],
    price_range: "$$",
    address_en: "No. 34, Section 3, Heping East Road, Da'an District",
    address_zh: "大安區和平東路三段34號",
    city: "Taipei",
    district: "Da'an",
    location: "POINT(121.5462 25.0238)",
    google_rating: 4.3,
    is_verified: true,
    is_active: true,
  },
  // ============================================================
  // ZHONGSHAN DISTRICT (中山區) — 8 restaurants
  // ============================================================
  {
    name_en: "Yang Shin Vegetarian Restaurant",
    name_zh: "養心茶樓 蔬食飲茶",
    slug: "yang-shin-vegetarian",
    description_en:
      "Taipei's first vegetarian dim sum restaurant, established in 2013. Over 30 varieties of handmade dim sum using natural ingredients with reduced sugar, salt, and oil. Vegan items clearly marked. Near Songjiang Nanjing MRT Exit 8. Reservations highly recommended.",
    vegetarian_types: ["ovo_lacto", "vegan"],
    cuisine_tags: ["Chinese", "Dim Sum"],
    price_range: "$$",
    address_en: "2F, No. 128, Songjiang Road, Zhongshan District",
    address_zh: "中山區松江路128號2樓",
    city: "Taipei",
    district: "Zhongshan",
    phone: "+886-2-2542-8828",
    location: "POINT(121.5328 25.0517)",
    google_rating: 4.2,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "MiaCucina (Nanxi)",
    name_zh: "MiaCucina 南西店",
    slug: "miacucina-nanxi",
    description_en:
      "Zhongshan branch of the popular Italian-inspired vegetarian chain inside Shin Kong Mitsukoshi department store. One-minute walk from Zhongshan MRT Exit 2. Same extensive menu of handmade pasta, pizza, and salads.",
    vegetarian_types: ["ovo_lacto", "vegetarian_friendly"],
    cuisine_tags: ["Italian", "Western"],
    price_range: "$$",
    address_en:
      "2F, No. 12, Nanjing West Road, Zhongshan District (Shin Kong Mitsukoshi Nanxi)",
    address_zh: "中山區南京西路12號2樓 (新光三越南西店)",
    city: "Taipei",
    district: "Zhongshan",
    location: "POINT(121.5233 25.0527)",
    google_rating: 4.0,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Guo Ran Hui (Zhongshan)",
    name_zh: "果然匯 中山店",
    slug: "guo-ran-hui-zhongshan",
    description_en:
      "Spacious multi-cuisine vegetarian buffet on Songjiang Road with over 80 meatless dishes spanning Japanese, Chinese, Mexican, Mediterranean, and Western cuisines. Always packed, so early reservations are essential.",
    vegetarian_types: ["ovo_lacto", "vegetarian_friendly"],
    cuisine_tags: ["Buffet", "Taiwanese", "Japanese", "Western"],
    price_range: "$$",
    address_en: "No. 275, Songjiang Road, Zhongshan District",
    address_zh: "中山區松江路275號",
    city: "Taipei",
    district: "Zhongshan",
    website: "https://www.fruitfulfood.com.tw",
    location: "POINT(121.5331 25.0576)",
    google_rating: 4.0,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Changchun Vegetarian Hall",
    name_zh: "長春食素名人館",
    slug: "changchun-vegetarian",
    description_en:
      "Beloved 20-year-old all-you-can-eat vegetarian restaurant offering handmade, natural dishes spanning Taiwanese, Hong Kong, Japanese, Korean, Thai, and Italian cuisines. Extremely affordable buffet with a warm, traditional atmosphere.",
    vegetarian_types: ["ovo_lacto", "vegan"],
    cuisine_tags: ["Taiwanese", "Chinese", "Buffet"],
    price_range: "$",
    address_en: "No. 38, Section 2, Xinsheng North Road, Zhongshan District",
    address_zh: "中山區新生北路二段38號",
    city: "Taipei",
    district: "Zhongshan",
    phone: "+886-2-2511-5656",
    location: "POINT(121.5294 25.0539)",
    google_rating: 3.8,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Mayur Indian Kitchen Vegetarian (MIK-3)",
    name_zh: "馬友友印度廚房 蔬食餐廳",
    slug: "mik-3-vegetarian",
    description_en:
      "Dedicated vegetarian and vegan South Indian restaurant, fully converted from non-veg to veg in 2018. No meat or alcohol served. Known for authentic dosas, thalis, and rich curries. Near Guanghua Digital Plaza.",
    vegetarian_types: ["ovo_lacto", "vegan"],
    cuisine_tags: ["Indian"],
    price_range: "$$",
    address_en: "No. 38, Section 1, Xinsheng North Road, Zhongshan District",
    address_zh: "中山區新生北路一段38號",
    city: "Taipei",
    district: "Zhongshan",
    phone: "+886-2-2541-6425",
    website: "https://www.mik3taiwan.com",
    location: "POINT(121.5295 25.0474)",
    google_rating: 4.2,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Spring Natural Vegetarian (Zhongshan)",
    name_zh: "春天素食 長春店",
    slug: "spring-natural-zhongshan",
    description_en:
      "Zhongshan branch of the prestigious Spring Natural vegetarian buffet chain. Offers an extensive spread of over 100 vegetarian dishes including salads, dim sum, hot dishes, soups, fruits, and desserts.",
    vegetarian_types: ["ovo_lacto", "vegetarian_friendly"],
    cuisine_tags: ["Taiwanese", "Chinese", "Buffet"],
    price_range: "$$$",
    address_en: "3F, No. 26, Changchun Road, Zhongshan District",
    address_zh: "中山區長春路26號3樓",
    city: "Taipei",
    district: "Zhongshan",
    phone: "+886-2-2525-1622",
    website: "http://www.springfood.com.tw",
    location: "POINT(121.5268 25.0533)",
    google_rating: 3.9,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Wulao Hot Pot (Zhongshan North)",
    name_zh: "無老鍋 中山北店",
    slug: "wulao-zhongshan",
    description_en:
      "Elegant health-focused hot pot with a name meaning 'never old pot'. Features nourishing herbal broths, organic vegetables, and handmade tofu in beautiful oriental contemporary decor. Vegetarian-friendly with dedicated veg broth options.",
    vegetarian_types: ["vegetarian_friendly"],
    cuisine_tags: ["Hot Pot"],
    price_range: "$$",
    address_en:
      "No. 36-1, Section 2, Zhongshan North Road, Zhongshan District",
    address_zh: "中山區中山北路二段36-1號",
    city: "Taipei",
    district: "Zhongshan",
    location: "POINT(121.5236 25.0555)",
    google_rating: 4.3,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Yu Gui Ren Vegetarian",
    name_zh: "玉貴人蔬食",
    slug: "yu-gui-ren",
    description_en:
      "Super affordable self-serve vegetarian buffet near Songjiang Nanjing MRT. Offers NT$150 all-you-can-eat in the evening with a rich selection of Taiwanese vegetarian dishes, bento boxes, and handmade items.",
    vegetarian_types: ["ovo_lacto", "vegan"],
    cuisine_tags: ["Taiwanese", "Buffet", "Rice Box"],
    price_range: "$",
    address_en:
      "No. 1, Lane 109, Section 3, Nanjing East Road, Zhongshan District",
    address_zh: "中山區南京東路三段109巷1號",
    city: "Taipei",
    district: "Zhongshan",
    location: "POINT(121.5369 25.0521)",
    google_rating: 4.1,
    is_verified: true,
    is_active: true,
  },
  // ============================================================
  // NEARBY DISTRICTS — for broader coverage
  // ============================================================
  {
    name_en: "Serenity (Zhenjiang)",
    name_zh: "祥和蔬食料理 鎮江店",
    slug: "serenity-zhenjiang",
    description_en:
      "Michelin Bib Gourmand for 7 consecutive years since 2018. Taiwan's first Sichuan-style vegetarian restaurant, opened in 2005. Known for deep flavors, bold heat, and signature deep-fried king oyster mushroom 'tripe'. Vegan and ovo-lacto options.",
    vegetarian_types: ["vegan", "ovo_lacto"],
    cuisine_tags: ["Chinese"],
    price_range: "$$",
    address_en: "No. 1, Lane 1, Zhenjiang Street, Zhongzheng District",
    address_zh: "中正區鎮江街1巷1號",
    city: "Taipei",
    district: "Zhongzheng",
    phone: "+886-2-2357-0377",
    website: "https://www.serenity.com.tw",
    location: "POINT(121.5227 25.0440)",
    google_rating: 4.3,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Ooh Cha Cha (Guting)",
    name_zh: "Ooh Cha Cha 自然食 古亭店",
    slug: "ooh-cha-cha-guting",
    description_en:
      "The original Ooh Cha Cha location right outside Guting MRT Exit 2. Same beloved all-vegan menu of burgers, sandwiches, bowls, and freshly baked desserts. Community-focused with a laid-back California vibe.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Western", "Brunch"],
    price_range: "$$",
    address_en: "No. 207, Section 2, Nanchang Road, Zhongzheng District",
    address_zh: "中正區南昌路二段207號",
    city: "Taipei",
    district: "Zhongzheng",
    phone: "+886-2-2367-7133",
    website: "https://www.oohchacha.com",
    location: "POINT(121.5214 25.0243)",
    google_rating: 4.4,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Serenity (Qingcheng)",
    name_zh: "祥和蔬食料理 慶城店",
    slug: "serenity-qingcheng",
    description_en:
      "Second branch of the Michelin Bib Gourmand Sichuan vegetarian restaurant near Nanjing Fuxing MRT, facing Qingcheng Park. Same bold, spicy flavors in a modern setting. Three-cup monkey head mushroom is a must-order.",
    vegetarian_types: ["vegan", "ovo_lacto"],
    cuisine_tags: ["Chinese"],
    price_range: "$$",
    address_en:
      "No. 7, Alley 7, Lane 303, Section 3, Nanjing East Road, Songshan District",
    address_zh: "松山區南京東路三段303巷7弄7號",
    city: "Taipei",
    district: "Songshan",
    phone: "+886-2-2546-6188",
    website: "https://www.serenity.com.tw",
    location: "POINT(121.5447 25.0520)",
    google_rating: 4.2,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Clavius",
    name_zh: "Clavius",
    slug: "clavius",
    description_en:
      "Michelin Bib Gourmand restaurant emphasizing Taiwanese plant-based whole foods with delicate Asian flavors and modern plating. Warm decor with picture windows overlooking lush greenery and a winding garden path. Closed Mondays.",
    vegetarian_types: ["vegan", "ovo_lacto"],
    cuisine_tags: ["Taiwanese", "Western"],
    price_range: "$$",
    address_en: "No. 120, Fujin Street, Songshan District",
    address_zh: "松山區富錦街120號",
    city: "Taipei",
    district: "Songshan",
    phone: "+886-2-2514-0356",
    location: "POINT(121.5570 25.0598)",
    google_rating: 4.4,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "BaganHood",
    name_zh: "BaganHood 蔬食餐酒館",
    slug: "baganhood",
    description_en:
      "Stylish all-vegan gastropub near Songshan Cultural & Creative Park. Serves Western-fusion dishes with craft cocktails, plus a retail corner with vegan grocery products. Established in 2019 and quickly became a community favorite.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Western", "Italian"],
    price_range: "$$",
    address_en:
      "No. 11, Alley 46, Lane 553, Section 4, Zhongxiao East Road, Xinyi District",
    address_zh: "信義區忠孝東路四段553巷46弄11號",
    city: "Taipei",
    district: "Xinyi",
    location: "POINT(121.5615 25.0415)",
    google_rating: 4.3,
    is_verified: true,
    is_active: true,
  },
  // ============================================================
  // XINYI DISTRICT (信義區) — additional restaurants
  // ============================================================
  {
    name_en: "Herbivore",
    name_zh: "Herbivore 草食",
    slug: "herbivore-xinyi",
    description_en:
      "All-vegan restaurant on the 2nd floor of Shin Kong Mitsukoshi A4 in the upscale Xinyi shopping district. Serves creative international plant-based cuisine from Italian pasta to Asian bowls. Popular for lunch sets with Taipei 101 views nearby.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Western", "Italian"],
    price_range: "$$",
    address_en: "2F, No. 19, Songgao Road, Xinyi District",
    address_zh: "信義區松高路19號2樓 (新光三越A4)",
    city: "Taipei",
    district: "Xinyi",
    phone: "+886-2-2723-5368",
    location: "POINT(121.5672 25.0360)",
    google_rating: 4.2,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Vege Creek (Taipei 101)",
    name_zh: "蔬河 台北101店",
    slug: "vege-creek-101",
    description_en:
      "Popular vegan noodle bar in the B1 food court of Taipei 101. Build your own bowl from fresh vegetables, mushrooms, tofu, and noodles in rich umami-packed broths. Affordable and quick dining in the heart of Xinyi's premier shopping landmark.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Taiwanese", "Noodles"],
    price_range: "$",
    address_en: "B1, No. 45, Shifu Road, Xinyi District (Taipei 101)",
    address_zh: "信義區市府路45號B1 (台北101)",
    city: "Taipei",
    district: "Xinyi",
    phone: "+886-2-8101-8171",
    location: "POINT(121.5647 25.0336)",
    google_rating: 4.2,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Loving Hut (Songde)",
    name_zh: "愛家國際餐飲 松德店",
    slug: "loving-hut-songde",
    description_en:
      "Part of the global Loving Hut vegan chain located near Xiangshan MRT station. Serves affordable Taiwanese-style vegan comfort food including rice plates, noodles, and stir-fried dishes. Fully vegan with no onion, garlic, or five pungent spices.",
    vegetarian_types: ["vegan", "five_spice"],
    cuisine_tags: ["Taiwanese", "Chinese"],
    price_range: "$",
    address_en: "No. 247, Songde Road, Xinyi District",
    address_zh: "信義區松德路247號",
    city: "Taipei",
    district: "Xinyi",
    phone: "+886-2-2346-0036",
    location: "POINT(121.5770 25.0345)",
    google_rating: 4.0,
    is_verified: true,
    is_active: true,
  },
  // ============================================================
  // ZHONGZHENG DISTRICT (中正區) — additional restaurants
  // ============================================================
  {
    name_en: "Rice Revolution",
    name_zh: "呷米蔬食",
    slug: "rice-revolution",
    description_en:
      "Sustainability-focused vegetarian restaurant near 228 Peace Park using over 90% organic Taiwanese ingredients. Serves seasonal set meals, vegan bento, and specialty drinks in a narrow three-story shophouse. A pioneer in Taipei's farm-to-table vegetarian movement since 2013.",
    vegetarian_types: ["vegan", "ovo_lacto"],
    cuisine_tags: ["Taiwanese"],
    price_range: "$$",
    address_en: "No. 9, Hengyang Road, Zhongzheng District",
    address_zh: "中正區衡陽路9號",
    city: "Taipei",
    district: "Zhongzheng",
    phone: "+886-2-2375-5870",
    location: "POINT(121.5135 25.0425)",
    google_rating: 4.3,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Lotus Virtue Vegetarian",
    name_zh: "蓮池閣素菜餐廳",
    slug: "lotus-virtue-zhongzheng",
    description_en:
      "Traditional Buddhist vegetarian restaurant on Ningbo West Street near Chiang Kai-Shek Memorial Hall. Offers a wide selection of Taiwanese and Chinese vegetarian dishes in a tranquil setting. Known for generous portions and reasonable prices.",
    vegetarian_types: ["vegan", "ovo_lacto", "five_spice"],
    cuisine_tags: ["Taiwanese", "Chinese"],
    price_range: "$",
    address_en: "No. 82, Ningbo West Street, Zhongzheng District",
    address_zh: "中正區寧波西街82號",
    city: "Taipei",
    district: "Zhongzheng",
    location: "POINT(121.5183 25.0310)",
    google_rating: 4.0,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "New Casa French Vegan",
    name_zh: "新卡莎法式素食西餐廳",
    slug: "new-casa-zhongzheng",
    description_en:
      "French-inspired vegan Western restaurant near Gongguan. Signature dish is the French-style monkey head mushroom steak on a sizzling iron plate. Also serves pasta, risotto, and elegant plant-based set meals.",
    vegetarian_types: ["vegan", "ovo_lacto"],
    cuisine_tags: ["Western"],
    price_range: "$$",
    address_en:
      "1F, No. 1, Lane 52, Section 4, Roosevelt Road, Zhongzheng District",
    address_zh: "中正區羅斯福路四段52巷1號1樓",
    city: "Taipei",
    district: "Zhongzheng",
    phone: "+886-2-2365-3339",
    location: "POINT(121.5333 25.0156)",
    google_rating: 4.1,
    is_verified: true,
    is_active: true,
  },
  // ============================================================
  // SONGSHAN DISTRICT (松山區) — additional restaurants
  // ============================================================
  {
    name_en: "Veggienius",
    name_zh: "不葷主義茶餐廳",
    slug: "veggienius-songshan",
    description_en:
      "Upscale vegetarian tea restaurant near Nanjing Fuxing MRT serving Hong Kong-style dim sum alongside Sichuan and Zhejiang vegetarian dishes. Hailed as the vegetarian Dintaifung. All dishes are either ovo-lacto or fully vegan, clearly labeled.",
    vegetarian_types: ["ovo_lacto", "vegan"],
    cuisine_tags: ["Chinese", "Dim Sum"],
    price_range: "$$",
    address_en: "2F, No. 275, Section 3, Nanjing East Road, Songshan District",
    address_zh: "松山區南京東路三段275號2樓",
    city: "Taipei",
    district: "Songshan",
    phone: "+886-2-2545-9977",
    location: "POINT(121.5448 25.0518)",
    google_rating: 4.8,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Yiihotang Vegan Bakery",
    name_zh: "一禾堂麵包本舖",
    slug: "yiihotang-songshan",
    description_en:
      "Artisan vegan bakery known for handcrafted breads and traditional Taiwanese pastries, all 100% plant-based. Famous for sea salt butter crescents made with fermented soy butter, pineapple cakes, and seasonal moon cakes.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Bakery", "Dessert"],
    price_range: "$",
    address_en: "No. 323, Fuxing North Road, Songshan District",
    address_zh: "松山區復興北路323號",
    city: "Taipei",
    district: "Songshan",
    phone: "+886-2-2545-0096",
    location: "POINT(121.5437 25.0608)",
    google_rating: 4.4,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Life Veggie",
    name_zh: "鮮蔬活複合式蔬食料理",
    slug: "life-veggie-songshan",
    description_en:
      "Compound-style vegetarian restaurant near Taipei Arena offering diverse international vegetarian cuisine. Uses Li Jen certified organic vegetables and seasonal fruits. Known for creative Thai basil dishes and affordable lunch sets.",
    vegetarian_types: ["ovo_lacto", "vegan"],
    cuisine_tags: ["Taiwanese", "Thai"],
    price_range: "$",
    address_en:
      "No. 14, Alley 5, Lane 133, Section 4, Nanjing East Road, Songshan District",
    address_zh: "松山區南京東路四段133巷5弄14號",
    city: "Taipei",
    district: "Songshan",
    phone: "+886-2-2719-2908",
    location: "POINT(121.5555 25.0516)",
    google_rating: 4.3,
    is_verified: true,
    is_active: true,
  },
  // ============================================================
  // WANHUA DISTRICT (萬華區) — 2 restaurants
  // ============================================================
  {
    name_en: "Ji Yuan Vegetarian Eatery",
    name_zh: "吉緣素食",
    slug: "ji-yuan-wanhua",
    description_en:
      "Beloved budget-friendly vegetarian noodle shop right next to Longshan Temple MRT station. All side dishes are a uniform NT$20 and dry noodles cost just NT$35. Famous for hearty angelica root soup noodles and spicy wontons.",
    vegetarian_types: ["vegan", "ovo_lacto"],
    cuisine_tags: ["Taiwanese", "Noodles"],
    price_range: "$",
    address_en:
      "No. 15, Lane 109, Section 3, Heping West Road, Wanhua District",
    address_zh: "萬華區和平西路三段109巷15號",
    city: "Taipei",
    district: "Wanhua",
    phone: "+886-2-2308-7717",
    location: "POINT(121.4998 25.0355)",
    google_rating: 4.1,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Quan Zhen Vegetarian",
    name_zh: "全真素食火鍋鐵板燒",
    slug: "quan-zhen-wanhua",
    description_en:
      "Small but popular vegetarian restaurant in a quiet lane off Hankou Street in Ximending. Serves Chinese-style vegetarian hot pot and teppanyaki dishes. Known for creative fusion dishes combining Chinese and Western flavors.",
    vegetarian_types: ["ovo_lacto", "vegan"],
    cuisine_tags: ["Chinese", "Hot Pot"],
    price_range: "$$",
    address_en: "No. 11, Lane 34, Section 2, Hankou Street, Wanhua District",
    address_zh: "萬華區漢口街二段34巷11號",
    city: "Taipei",
    district: "Wanhua",
    location: "POINT(121.5060 25.0438)",
    google_rating: 4.5,
    is_verified: true,
    is_active: true,
  },
  // ============================================================
  // DATONG DISTRICT (大同區) — 2 restaurants
  // ============================================================
  {
    name_en: "Minder Vegetarian (Q Square)",
    name_zh: "明德素食園 京站店",
    slug: "minder-vegetarian-qsquare",
    description_en:
      "Popular vegetarian buffet in the B3 food court of Q Square shopping mall at Taipei Main Station. Pay-by-plate system with a wide variety of Taiwanese vegetarian dishes. Extremely affordable and convenient for travelers.",
    vegetarian_types: ["ovo_lacto", "vegan"],
    cuisine_tags: ["Taiwanese", "Chinese", "Buffet"],
    price_range: "$",
    address_en:
      "B3, Q Square, No. 1, Section 1, Chengde Road, Datong District",
    address_zh: "大同區承德路一段1號B3 (京站時尚廣場)",
    city: "Taipei",
    district: "Datong",
    location: "POINT(121.5181 25.0486)",
    google_rating: 3.9,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Vegan Taipei",
    name_zh: "潔暘素食餐廳",
    slug: "vegan-taipei-datong",
    description_en:
      "Cozy vegan cafe and bakery in the Datong district serving fresh-baked goods, vegan pizza, sandwiches, and light meals. Known for friendly English-speaking service and a welcoming atmosphere.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Western", "Bakery"],
    price_range: "$",
    address_en: "No. 135, Section 2, Minsheng West Road, Datong District",
    address_zh: "大同區民生西路135號",
    city: "Taipei",
    district: "Datong",
    phone: "+886-2-2557-8587",
    location: "POINT(121.5138 25.0561)",
    google_rating: 4.2,
    is_verified: true,
    is_active: true,
  },
  // ============================================================
  // SHILIN DISTRICT (士林區) — 3 restaurants
  // ============================================================
  {
    name_en: "Yangming Spring",
    name_zh: "陽明春天",
    slug: "yangming-spring",
    description_en:
      "Michelin Green Star restaurant on Yangmingshan offering exquisite plant-based fine dining in a zen-inspired cultural space. Set among Japanese gardens with rock arrangements and bonsai. Signature monkey head mushroom steak is a must-try.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Taiwanese", "Japanese"],
    price_range: "$$$",
    address_en: "No. 119-1, Jingshan Road, Shilin District",
    address_zh: "士林區菁山路119之1號",
    city: "Taipei",
    district: "Shilin",
    phone: "+886-2-2862-0178",
    website: "https://ymspring.com.tw",
    location: "POINT(121.5594 25.1442)",
    google_rating: 4.3,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "MiaCucina (Tianmu)",
    name_zh: "MiaCucina 天母店",
    slug: "miacucina-tianmu",
    description_en:
      "Tianmu branch of the popular Italian-inspired vegetarian chain. Full menu of handmade pasta, wood-fired pizza, risotto, salads, and brunch items. Very popular with the expat community in Shilin/Tianmu area.",
    vegetarian_types: ["ovo_lacto", "vegetarian_friendly"],
    cuisine_tags: ["Italian", "Western", "Brunch"],
    price_range: "$$",
    address_en: "No. 48, Dexing West Road, Shilin District",
    address_zh: "士林區德行西路48號",
    city: "Taipei",
    district: "Shilin",
    phone: "+886-2-8866-2679",
    location: "POINT(121.5267 25.1085)",
    google_rating: 4.1,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Happy Bird Vegetarian",
    name_zh: "Happy Bird 快樂鳥蔬食餐廳",
    slug: "happy-bird-shilin",
    description_en:
      "Mediterranean-inspired vegetarian restaurant set in a beautifully restored 1950s American military residence on Yangmingshan. Offers all-day dining with pizzas, pastas, burgers, salads, and desserts. Features scenic garden views and lush outdoor seating.",
    vegetarian_types: ["ovo_lacto", "vegan"],
    cuisine_tags: ["Italian", "Western", "Brunch"],
    price_range: "$$",
    address_en: "No. 10, Guotai Street, Shilin District",
    address_zh: "士林區國泰街10號",
    city: "Taipei",
    district: "Shilin",
    phone: "+886-2-2862-2007",
    location: "POINT(121.5404 25.1350)",
    google_rating: 4.8,
    is_verified: true,
    is_active: true,
  },
  // ============================================================
  // BEITOU DISTRICT (北投區) — 2 restaurants
  // ============================================================
  {
    name_en: "Su Vegetarian Food",
    name_zh: "Su蔬食料理",
    slug: "su-vegetarian-beitou",
    description_en:
      "Modern fusion vegetarian restaurant on Guangming Road in Beitou serving creative Chinese, Italian, and international plant-based dishes. Known for elegant set meals. Perfect for a refined meal after visiting Beitou hot springs.",
    vegetarian_types: ["vegan", "ovo_lacto"],
    cuisine_tags: ["Chinese", "Western"],
    price_range: "$$",
    address_en: "No. 228, Guangming Road, Beitou District",
    address_zh: "北投區光明路228號",
    city: "Taipei",
    district: "Beitou",
    phone: "+886-2-2894-6428",
    location: "POINT(121.5042 25.1368)",
    google_rating: 4.0,
    is_verified: true,
    is_active: true,
  },
  {
    name_en: "Burger Su",
    name_zh: "Burger Su 美式蔬食漢堡專賣店",
    slug: "burger-su-beitou",
    description_en:
      "Dedicated vegetarian burger and submarine sandwich shop in Beitou. Serves creative plant-based burgers, subs, and sides using house-made patties. A fun, casual spot for American-style vegan comfort food.",
    vegetarian_types: ["vegan", "ovo_lacto"],
    cuisine_tags: ["Western", "Fast Food"],
    price_range: "$",
    address_en: "No. 36-1, Section 2, Zhongyang South Road, Beitou District",
    address_zh: "北投區中央南路二段36-1號",
    city: "Taipei",
    district: "Beitou",
    phone: "+886-2-2891-8150",
    location: "POINT(121.5014 25.1320)",
    google_rating: 4.4,
    is_verified: true,
    is_active: true,
  },
  // ============================================================
  // NEIHU DISTRICT (內湖區) — 1 restaurant
  // ============================================================
  {
    name_en: "MiaCucina (Neihu)",
    name_zh: "MiaCucina 內湖店",
    slug: "miacucina-neihu",
    description_en:
      "Neihu Science Park branch of the popular Italian-inspired vegetarian chain near Jiannan Road MRT. Extensive menu of handmade pasta, wood-fired pizza, risotto, and salads. A reliable lunch choice for tech workers in the Neihu area.",
    vegetarian_types: ["ovo_lacto", "vegetarian_friendly"],
    cuisine_tags: ["Italian", "Western", "Brunch"],
    price_range: "$$",
    address_en: "No. 601, Ruiguang Road, Neihu District",
    address_zh: "內湖區瑞光路601號",
    city: "Taipei",
    district: "Neihu",
    phone: "+886-2-2659-3918",
    location: "POINT(121.5671 25.0800)",
    google_rating: 4.0,
    is_verified: true,
    is_active: true,
  },
  // ============================================================
  // NANGANG DISTRICT (南港區) — 1 restaurant
  // ============================================================
  {
    name_en: "Go Young Veg Kitchen Cafe",
    name_zh: "高仰三廚房 義式蔬食",
    slug: "go-young-nangang",
    description_en:
      "Italian-inspired vegetarian cafe on the 3rd floor of CITYLINK at Nangang Station. Offers vegetarian pasta, risotto, salads, and afternoon tea sets. Convenient for travelers using Nangang HSR station.",
    vegetarian_types: ["ovo_lacto", "vegan"],
    cuisine_tags: ["Italian", "Western", "Brunch"],
    price_range: "$$",
    address_en:
      "3F, Building A, No. 369, Section 7, Zhongxiao East Road, Nangang District",
    address_zh: "南港區忠孝東路七段369號A棟3樓 (CITYLINK南港店)",
    city: "Taipei",
    district: "Nangang",
    phone: "+886-2-2652-9260",
    location: "POINT(121.6065 25.0530)",
    google_rating: 4.0,
    is_verified: true,
    is_active: true,
  },
  // ============================================================
  // WENSHAN DISTRICT (文山區) — 1 restaurant
  // ============================================================
  {
    name_en: "Satya Veganism",
    name_zh: "諦 Veganism 共響空間",
    slug: "satya-veganism-wenshan",
    description_en:
      "Vegan restaurant promoting sattvic food philosophy combining Indian, Western, and Taiwanese dishes. Beautiful interior with warm wood tones and a peaceful atmosphere. Five minutes walk from Jingan MRT station.",
    vegetarian_types: ["vegan"],
    cuisine_tags: ["Indian", "Western", "Taiwanese"],
    price_range: "$",
    address_en: "No. 87, Section 4, Tingzhou Road, Wenshan District",
    address_zh: "文山區汀州路四段87號",
    city: "Taipei",
    district: "Wenshan",
    phone: "+886-2-2933-7477",
    location: "POINT(121.5329 25.0020)",
    google_rating: 4.5,
    is_verified: true,
    is_active: true,
  },
];

async function seed() {
  console.log(`Seeding ${SEED_RESTAURANTS.length} real restaurants...\n`);

  // Count by district for summary
  const districtCounts: Record<string, number> = {};
  for (const r of SEED_RESTAURANTS) {
    districtCounts[r.district] = (districtCounts[r.district] || 0) + 1;
  }
  console.log("District breakdown:");
  for (const [district, count] of Object.entries(districtCounts)) {
    console.log(`  ${district}: ${count}`);
  }
  console.log();

  let successCount = 0;
  let errorCount = 0;

  for (const restaurant of SEED_RESTAURANTS) {
    const { error } = await supabase.from("restaurants").upsert(restaurant, {
      onConflict: "slug",
    });

    if (error) {
      console.error(`  x ${restaurant.name_en}: ${error.message}`);
      errorCount++;
    } else {
      console.log(`  + ${restaurant.name_en} (${restaurant.district})`);
      successCount++;
    }
  }

  console.log(
    `\nDone! ${successCount} seeded, ${errorCount} errors, ${SEED_RESTAURANTS.length} total.`
  );
}

seed().catch(console.error);
