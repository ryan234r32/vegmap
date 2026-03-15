import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { menu_id, image_url } = body;

  if (!menu_id && !image_url) {
    return NextResponse.json(
      { data: null, error: "menu_id or image_url is required" },
      { status: 400 }
    );
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return NextResponse.json(
      { data: null, error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Step 1: OCR + Translate with GPT-4o-mini Vision
    const ocrResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert at reading Chinese vegetarian restaurant menus and translating them to English.
Given a menu image, extract all items and return a JSON array where each item has:
- name_zh: Chinese name
- name_en: Natural English translation (not literal)
- description_en: Brief English description of the dish
- price: Number (NTD) or null
- category: Category like "Appetizer", "Main Course", "Soup", "Noodles", "Rice", "Dessert", "Drinks"
- is_vegan: boolean (true if no dairy/eggs)
- allergens: string array of common allergens (e.g., "soy", "gluten", "nuts", "sesame")
- ai_translated: true
- community_verified: false

Return ONLY valid JSON array, no markdown.`,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: image_url },
              },
              {
                type: "text",
                text: "Please extract and translate all menu items from this image.",
              },
            ],
          },
        ],
        max_tokens: 4096,
        temperature: 0.2,
      }),
    });

    const ocrData = await ocrResponse.json();
    const content = ocrData.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { data: null, error: "Failed to extract menu items" },
        { status: 500 }
      );
    }

    const items = JSON.parse(content);

    // Step 2: Update or create menu in database
    if (menu_id) {
      const { data, error } = await supabase
        .from("menus")
        .update({
          items,
          translation_status: "ai_translated",
        })
        .eq("id", menu_id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ data: null, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ data, error: null });
    }

    return NextResponse.json({ data: { items }, error: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Translation failed";
    return NextResponse.json({ data: null, error: message }, { status: 500 });
  }
}
