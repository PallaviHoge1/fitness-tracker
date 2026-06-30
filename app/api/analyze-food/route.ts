import { NextRequest, NextResponse } from "next/server";

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
- Multiple items separated by commas, "and", "+", or newlines = one object per item
- If grams not specified, use the standard serving size for that food
- All values represent the total for the actual quantity consumed, NOT per 100g
- Use cooked weight unless raw is specified
- For dishes like biryani, dal, pasta use typical recipe composition
- If something is truly unidentifiable, return name unknown with all numeric fields as 0
- Return ONLY the JSON array, nothing else`;

export async function POST(req: NextRequest) {
  const debugInfo: string[] = [];

  try {
    const body = await req.json();
    const input = body?.input;
    debugInfo.push("Got input: " + (typeof input === "string" ? input.substring(0, 50) : typeof input));

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return NextResponse.json({ error: "Missing food input", debug: debugInfo }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      debugInfo.push("GEMINI_API_KEY is NOT set");
      return NextResponse.json({ error: "Gemini API key not configured", debug: debugInfo }, { status: 500 });
    }
    debugInfo.push("API key present, length: " + apiKey.length);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiBody = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          parts: [{ text: input.trim() }],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
    };

    debugInfo.push("Calling Gemini...");
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    debugInfo.push("Gemini status: " + response.status);

    const responseText = await response.text();
    debugInfo.push("Response length: " + responseText.length);

    if (!response.ok) {
      debugInfo.push("Error body: " + responseText.substring(0, 500));
      return NextResponse.json(
        { error: "Gemini API error: " + response.status, debug: debugInfo },
        { status: 502 }
      );
    }

    const data = JSON.parse(responseText);
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      debugInfo.push("No text found. Keys: " + Object.keys(data).join(", "));
      if (data.candidates) {
        debugInfo.push("Candidates: " + JSON.stringify(data.candidates).substring(0, 300));
      }
      return NextResponse.json({ error: "Empty response from AI", debug: debugInfo }, { status: 502 });
    }

    debugInfo.push("AI text: " + text.substring(0, 100));

    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) {
      debugInfo.push("Parsed type: " + typeof parsed);
      return NextResponse.json({ error: "Invalid response format", debug: debugInfo }, { status: 502 });
    }

    return NextResponse.json({ items: parsed });
  } catch (error: any) {
    debugInfo.push("Exception: " + (error?.message || String(error)));
    return NextResponse.json(
      { error: error?.message || "Unknown error", debug: debugInfo },
      { status: 500 }
    );
  }
}
