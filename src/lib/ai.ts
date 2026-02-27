import { TripPayload, ItineraryResult } from "@/types";

export async function generateItinerary(payload: TripPayload): Promise<{ success: boolean; data?: ItineraryResult; error?: string }> {
    try {
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
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export const formatItineraryData = (data: any): ItineraryResult | null => {
    if (!data) return null;

    // AI sent string/markdown
    if (typeof data === "string") {
        try {
            const cleaned = data
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            const parsed = JSON.parse(cleaned);
            return normalizeItinerary(parsed);
        } catch {
            return null;
        }
    }

    return normalizeItinerary(data);
};

const normalizeItinerary = (parsed: any): ItineraryResult => {
    if (
        parsed.itinerary &&
        !Array.isArray(parsed.itinerary) &&
        typeof parsed.itinerary === "object"
    ) {
        parsed.itinerary = Object.entries(parsed.itinerary).map(
            ([key, value]: any, index) => ({
                day: index + 1,
                ...value,
            })
        );
    }

    return parsed;
};
