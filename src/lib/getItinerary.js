// src/lib/getItinerary.js
export async function getItinerary(payload) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to fetch itinerary");
  }

  const json = await res.json();
  return json;
}
