import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import type { TripPayload } from "@/types";

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { success: false, error: "GROQ_API_KEY is not configured" },
        { status: 403 }
      );
    }

    const body = (await req.json()) as TripPayload;
    const { transportation, accommodation, trip } = body;

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `
You are a professional travel planner AI.

STRICT RULES:
- Output MUST be valid JSON
- DO NOT add explanations
- DO NOT use markdown
- DO NOT wrap with \`\`\`
- Use EXACT structure below
- Provide realistic price alternatives (e.g., Kereta A, Kereta B) that fit the user's budget.
- For accommodations, provide realistic options with specific locations based on the user's preference (e.g., if they pick Pusat Kota, output hotels in Pusat Kota).
- ALL cost fields MUST be a string representing a range according to the budget, e.g., "150000 - 250000" or "20000 - 50000". Do NOT use single numbers for costs.
- Ensure activities are geographically logical (searah / berdekatan). For example, if visiting a museum in the morning, the next destination and lunch should be nearby.
- Provide multiple activities per day based on the requested pace (Santai, Normal, Cepat).
- Activity costs must fit the user's daily activity budget.

JSON STRUCTURE:
{
  "metadata": {
    "destination": string,
    "total_days": number,
    "theme_or_style": [string],
    "transportation_options": [
      {
        "id": string,
        "type": string,
        "name": string,
        "price": number,
        "description": string
      }
    ],
    "accommodation_options": [
      {
        "id": string,
        "type": string,
        "name": string,
        "price_per_night": number,
        "location": string,
        "description": string
      }
    ],
    "estimated_total_cost_idr": {
      "transportation": string,
      "accommodation": string,
      "activities": string,
      "others": string,
      "total": string
    }
  },
  "itinerary": [
    {
      "day_number": number,
      "theme": string,
      "activities": [
        {
          "time": string,
          "activity": string,
          "location": string,
          "duration": string,
          "description": string,
          "cost_estimate_idr": string
        }
      ],
      "tips": string
    }
  ]
}

INPUT DATA:
${JSON.stringify({ transportation, accommodation, trip }, null, 2)}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 1500,
    });

    const text = completion.choices?.[0]?.message?.content ?? "";

    let parsed;
    try {
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { raw: text };
    }

    return NextResponse.json({ success: true, data: parsed }, { status: 200 });
  } catch (err: any) {
    console.error("AI route error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
