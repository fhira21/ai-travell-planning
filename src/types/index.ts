export type TransportInput = {
    from: string;
    to: string;
    mode: string;
    transportBudget: string;
    preference: string;
};

export type StayInput = {
    stayType: string;
    budgetPerNight: string;
    locationPreference: string;
    nights: number;
    guests: number;
};

export type TripInput = {
    styles: string[];
    activityBudget: string;
    days: number;
    pace: string;
};

export type TripPayload = {
    transportation: TransportInput;
    accommodation: StayInput;
    trip: TripInput;
};

export type DailyItinerary = {
    day: number;
    title?: string;
    morning?: string;
    afternoon?: string;
    evening?: string;
    estimated_cost?: string;
    notes?: string;
};

export type ItineraryResult = {
    itinerary?: any[];
    metadata?: {
        destination: string;
        estimated_total_cost_idr: {
            transportation: string;
            accommodation: string;
            activities: string;
            others: string;
            total: string;
        };
        theme: string;
        transportation_options?: {
            id: string;
            type: string; // e.g., "Train", "Bus", "Flight"
            name: string; // e.g., "Kereta A"
            price: number; // e.g., 299000
            description?: string; // departure details
        }[];
        accommodation_options?: {
            id: string;
            type: string; // e.g., "Homestay", "Hotel"
            name: string;
            price_per_night: number;
            location: string; // e.g., "Pusat Kota", "Dekat tempat wisata"
            description?: string;
        }[];
    };
};

export type SavedTrip = {
    id: string;
    createdAt: number;
    payload: TripPayload;
    result: ItineraryResult;
};
