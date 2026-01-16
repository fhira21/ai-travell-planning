import Groq from "groq-sdk";

export async function POST(req) {
  try {
    // 🔴 VALIDASI API KEY
    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "GROQ_API_KEY is not configured",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
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

JSON STRUCTURE:
{
  "transportation": {
    "recommended": string,
    "duration": string,
    "estimated_price": string,
    "notes": string
  },
  "accommodation": {
    "recommended_area": string,
    "type": string,
    "price_per_night": string,
    "total_price": string
  },
  "itinerary": [
    {
      "day": number,
      "title": string,
      "morning": string,
      "afternoon": string,
      "evening": string,
      "estimated_cost": string,
      "notes": string
    }
  ],
  "cost_summary": {
    "transportation": string,
    "accommodation": string,
    "activities": string,
    "total": string
  },
  "tips": [string],
  "recommendations": string
}

INPUT DATA:
${JSON.stringify({ transportation, accommodation, trip }, null, 2)}
`;


    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,        // 🔴 WAJIB
      max_tokens: 1200,
    });


    const text = completion.choices?.[0]?.message?.content ?? "";

    let parsed;
    try {
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { raw: text };
    }


    return new Response(
      JSON.stringify({ success: true, data: parsed }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("AI route error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
