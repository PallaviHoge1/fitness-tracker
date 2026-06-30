import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are a precise nutrition database. The user will give you food items they ate. Respond with ONLY a valid JSON array. No markdown fences. No preamble. No explanation.

For each distinct food item return:
{
  "name": "<canonical name in English, lowercase>",
  "grams": <estimated grams as number>,
  "calories": <kcal, integer>,
  "protein_g": <number, 1 decimal>,
  "carbs_g": <number, 1 decimal>,
  "fat_g": <number, 1 decimal>,
  "fiber_g": <number, 1 decimal>,
  "iron_mg": <number, 1 decimal>,
  "calcium_mg": <integer>,
  "vitamin_d_iu": <integer>,
  "vitamin_b12_mcg": <number, 1 decimal>,
  "magnesium_mg": <integer>,
  "potassium_mg": <integer>,
  "zinc_mg": <number, 1 decimal>,
  "sodium_mg": <integer>
}

Rules:
- Multiple items separated by commas, "and", "+", or newlines → one object per item
- If grams not specified, use the standard serving size for that food (e.g. 1 cup cooked rice = 158g, 1 large egg = 50g, 1 chicken breast = 174g, 1 medium banana = 118g, 1 slice bread = 30g, 1 tbsp oil = 14g)
- All values represent the total for the actual quantity consumed — NOT per 100g
- Use cooked weight unless raw is specified
- For dishes (e.g. "biryani", "dal", "pasta") use typical recipe composition
- If something is truly unidentifiable, return name "unknown" with all numeric fields as 0
- Return ONLY the JSON array, nothing else`;

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return NextResponse.json({ error: "Missing food input" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(input.trim());
    const text = result.response.text().trim();

    // Clean markdown fences if Gemini wraps them
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) {
      return NextResponse.json({ error: "Invalid response format" }, { status: 502 });
    }

    return NextResponse.json({ items: parsed });
  } catch (error) {
    console.error("Food analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze food. Try rephrasing." },
      { status: 500 }
    );
  }
}
