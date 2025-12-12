// src/app/api/ai/route.js
import Groq from "groq-sdk";

export async function POST(req) {
  try {
    const body = await req.json();
    const { transportation, accommodation, trip } = body;

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Build detailed prompt
    const prompt = `
You are an expert travel planner. Based on the input JSON, create a detailed itinerary including:
1) Recommended transport option(s) with estimated price and duration
2) Recommended accommodation with estimated nightly & total cost (and recommended neighborhoods)
3) A day-by-day itinerary for the number of days requested, with top attractions, food suggestions, estimated costs per activity
4) Summary of total estimated costs (transport + accommodation + activities)
5) Travel tips and warnings

Input JSON:
${JSON.stringify({ transportation, accommodation, trip }, null, 2)}

Output MUST be JSON with keys:
{
  "transportation": { "recommended": "...", "estimated_price": "...", "duration": "...", "notes": "..." },
  "accommodation": { "recommended_area": "...", "type": "...", "price_per_night": "...", "total_price": "..." },
  "itinerary": [
     { "day": 1, "morning": "...", "afternoon": "...", "evening": "...", "estimated_cost": "..." }
  ],
  "cost_summary": { "transport": "...", "accommodation": "...", "activities": "...", "total_estimated": "..." },
  "tips": ["..."]
}

Return ONLY valid JSON.
`;

    // call Groq chat endpoint
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 1200,
    });

    const text = completion.choices?.[0]?.message?.content ?? "";

    // Try to parse JSON; if parsing fails, return raw text as fallback
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      // fallback: return raw text
      parsed = { raw: text };
    }

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("AI route error", err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
