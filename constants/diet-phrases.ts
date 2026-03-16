/**
 * Bilingual diet phrases for the Diet Communication Card.
 * Used to help foreigners communicate dietary needs to restaurant staff in Taiwan.
 */

export type DietType =
  | "vegan"
  | "ovo_lacto"
  | "lacto"
  | "ovo"
  | "pescatarian"
  | "no_five_pungent";

export type Allergen =
  | "gluten"
  | "nuts"
  | "soy"
  | "sesame"
  | "mushroom"
  | "msg";

export interface DietOption {
  value: DietType;
  label_en: string;
  label_zh: string;
  description_en: string;
  card_text_zh: string;
  card_text_en: string;
  avoid_zh: string[];
  avoid_en: string[];
}

export interface AllergenOption {
  value: Allergen;
  label_en: string;
  label_zh: string;
  card_text_zh: string;
}

export const DIET_OPTIONS: DietOption[] = [
  {
    value: "vegan",
    label_en: "Vegan (Strict)",
    label_zh: "純素 / 全素",
    description_en: "No animal products at all — no meat, fish, eggs, dairy, or honey",
    card_text_zh: "我吃純素（全素）。請不要加任何動物性食材，包括肉、魚、蛋、奶、蜂蜜。",
    card_text_en: "I am strictly vegan. Please do not add any animal products, including meat, fish, eggs, dairy, or honey.",
    avoid_zh: ["肉類", "海鮮", "蛋", "牛奶/乳製品", "蜂蜜", "起司/奶油"],
    avoid_en: ["Meat", "Seafood", "Eggs", "Dairy / milk", "Honey", "Cheese / butter"],
  },
  {
    value: "ovo_lacto",
    label_en: "Ovo-Lacto Vegetarian",
    label_zh: "蛋奶素",
    description_en: "No meat or fish, but eggs and dairy are OK",
    card_text_zh: "我吃蛋奶素。可以吃蛋和牛奶，但請不要加肉類或海鮮。",
    card_text_en: "I eat ovo-lacto vegetarian. Eggs and dairy are fine, but no meat or seafood please.",
    avoid_zh: ["肉類", "海鮮", "魚"],
    avoid_en: ["Meat", "Seafood", "Fish"],
  },
  {
    value: "lacto",
    label_en: "Lacto Vegetarian",
    label_zh: "奶素",
    description_en: "No meat, fish, or eggs — dairy is OK",
    card_text_zh: "我吃奶素。可以喝牛奶，但請不要加肉、海鮮或蛋。",
    card_text_en: "I eat lacto vegetarian. Dairy is fine, but no meat, seafood, or eggs please.",
    avoid_zh: ["肉類", "海鮮", "蛋"],
    avoid_en: ["Meat", "Seafood", "Eggs"],
  },
  {
    value: "ovo",
    label_en: "Ovo Vegetarian",
    label_zh: "蛋素",
    description_en: "No meat, fish, or dairy — eggs are OK",
    card_text_zh: "我吃蛋素。可以吃蛋，但請不要加肉、海鮮或牛奶。",
    card_text_en: "I eat ovo vegetarian. Eggs are fine, but no meat, seafood, or dairy please.",
    avoid_zh: ["肉類", "海鮮", "牛奶/乳製品"],
    avoid_en: ["Meat", "Seafood", "Dairy / milk"],
  },
  {
    value: "pescatarian",
    label_en: "Pescatarian",
    label_zh: "魚素（海鮮素）",
    description_en: "No meat, but fish and seafood are OK",
    card_text_zh: "我不吃肉，但可以吃魚和海鮮。請不要加豬肉、牛肉、雞肉等肉類。",
    card_text_en: "I don't eat meat, but fish and seafood are fine. No pork, beef, or chicken please.",
    avoid_zh: ["豬肉", "牛肉", "雞肉", "其他肉類"],
    avoid_en: ["Pork", "Beef", "Chicken", "Other meat"],
  },
  {
    value: "no_five_pungent",
    label_en: "Vegan + No Five Pungent",
    label_zh: "五辛素（不含蔥蒜韭菜）",
    description_en: "Vegan AND no garlic, onion, leek, chive, or shallot (Buddhist vegetarian)",
    card_text_zh: "我吃全素，而且不吃五辛（蔥、蒜、韭菜、蕎頭、洋蔥）。謝謝！",
    card_text_en: "I eat strict vegan AND no five pungent roots (garlic, onion, leek, chive, shallot).",
    avoid_zh: ["肉類", "海鮮", "蛋", "乳製品", "蜂蜜", "蔥", "蒜", "韭菜", "蕎頭", "洋蔥"],
    avoid_en: ["Meat", "Seafood", "Eggs", "Dairy", "Honey", "Green onion", "Garlic", "Leek", "Chive", "Shallot/Onion"],
  },
];

export const ALLERGEN_OPTIONS: AllergenOption[] = [
  {
    value: "gluten",
    label_en: "Gluten / Wheat",
    label_zh: "麩質 / 小麥",
    card_text_zh: "我對麩質（小麥）過敏，請不要加含麵粉的食材。",
  },
  {
    value: "nuts",
    label_en: "Tree Nuts / Peanuts",
    label_zh: "堅果 / 花生",
    card_text_zh: "我對堅果和花生過敏，請確認食材中沒有堅果或花生。",
  },
  {
    value: "soy",
    label_en: "Soy",
    label_zh: "大豆",
    card_text_zh: "我對大豆過敏，請不要加豆腐、醬油或其他黃豆製品。",
  },
  {
    value: "sesame",
    label_en: "Sesame",
    label_zh: "芝麻",
    card_text_zh: "我對芝麻過敏，請不要加芝麻或芝麻油。",
  },
  {
    value: "mushroom",
    label_en: "Mushrooms",
    label_zh: "菇類",
    card_text_zh: "我不能吃菇類，請不要加任何菇類或蕈類。",
  },
  {
    value: "msg",
    label_en: "MSG",
    label_zh: "味精",
    card_text_zh: "請不要加味精（MSG）。",
  },
];

/** Common hidden animal ingredients in Taiwanese vegetarian food */
export const HIDDEN_INGREDIENTS = [
  { zh: "蝦米", en: "Dried shrimp", description: "Often in stir-fries and soups" },
  { zh: "豬油", en: "Lard (pork fat)", description: "Used for frying in many traditional restaurants" },
  { zh: "雞粉", en: "Chicken powder", description: "Common seasoning even in 'vegetarian' dishes" },
  { zh: "蠔油", en: "Oyster sauce", description: "Very common in stir-fries, sauces, and marinades" },
  { zh: "魚露", en: "Fish sauce", description: "Used in Thai and some Taiwanese dishes" },
  { zh: "柴魚", en: "Bonito flakes", description: "Used in Japanese-style dashi broth" },
  { zh: "蝦醬", en: "Shrimp paste", description: "In some Southeast Asian style dishes" },
  { zh: "蜂蜜", en: "Honey", description: "In desserts, drinks, and some sauces" },
  { zh: "吉利丁", en: "Gelatin", description: "In puddings, jelly, and some desserts" },
  { zh: "動物性奶油", en: "Animal butter/cream", description: "In bakery items and Western dishes" },
];

/** Useful Chinese phrases for dining */
export const USEFUL_PHRASES = [
  { zh: "這道菜有肉嗎？", en: "Does this dish have meat?" },
  { zh: "這是全素的嗎？", en: "Is this fully vegan?" },
  { zh: "有蛋或牛奶嗎？", en: "Does it contain eggs or milk?" },
  { zh: "可以不加蔥蒜嗎？", en: "Can you leave out green onion and garlic?" },
  { zh: "有素食菜單嗎？", en: "Do you have a vegetarian menu?" },
  { zh: "我吃素", en: "I'm vegetarian" },
  { zh: "謝謝", en: "Thank you" },
  { zh: "不好意思", en: "Excuse me" },
];

/** Taiwan vegetarian label explanations */
export const TAIWAN_VEG_LABELS = [
  {
    label_zh: "全素/純素",
    label_en: "Vegan",
    icon: "🌱",
    description: "No animal products AND no five pungent vegetables (garlic, onion, etc.)",
    warning: "This is Buddhist vegan — it excludes garlic and onion, which is stricter than Western vegan in some ways but should be safe for Western vegans.",
  },
  {
    label_zh: "蛋素",
    label_en: "Ovo vegetarian",
    icon: "🥚",
    description: "Contains eggs but no dairy, meat, or five pungent vegetables",
    warning: null,
  },
  {
    label_zh: "奶素",
    label_en: "Lacto vegetarian",
    icon: "🥛",
    description: "Contains dairy but no eggs, meat, or five pungent vegetables",
    warning: null,
  },
  {
    label_zh: "蛋奶素",
    label_en: "Ovo-lacto vegetarian",
    icon: "🥛🥚",
    description: "Contains both eggs and dairy, but no meat or five pungent vegetables",
    warning: null,
  },
  {
    label_zh: "植物五辛素",
    label_en: "Vegan with five pungent",
    icon: "🧄",
    description: "Plant-based but INCLUDES garlic, onion, leek, chive, and shallot",
    warning: "This is closest to Western vegan — plant-based with garlic and onion allowed. However, always double-check for hidden dairy or eggs.",
  },
];
