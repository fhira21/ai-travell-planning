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
You are an expert travel planner. Based on the input JSON, create a detailed itinerary including:
1) Recommended transport option(s) with estimated price and duration
2) Recommended accommodation with estimated nightly & total cost
3) A day-by-day itinerary
4) Summary of total estimated costs
5) Travel tips

Input JSON:
${JSON.stringify({ transportation, accommodation, trip }, null, 2)}

Return ONLY valid JSON.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 1200,
    });

    const text = completion.choices?.[0]?.message?.content ?? "";

    let parsed;
    try {
      parsed = JSON.parse(text);
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
