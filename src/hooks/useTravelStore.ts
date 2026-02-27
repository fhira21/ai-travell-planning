import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SavedTrip, TripPayload, ItineraryResult } from '@/types';

interface TravelStore {
    history: SavedTrip[];
    favorites: string[]; // array of SavedTrip IDs
    addTrip: (payload: TripPayload, result: ItineraryResult) => string;
    removeTrip: (id: string) => void;
    toggleFavorite: (id: string) => void;
    clearHistory: () => void;
}

export const useTravelStore = create<TravelStore>()(
    persist(
        (set) => ({
            history: [],
            favorites: [],
            addTrip: (payload, result) => {
                const id = crypto.randomUUID();
                const newTrip: SavedTrip = {
                    id,
                    createdAt: Date.now(),
                    payload,
                    result,
                };
                set((state) => ({ history: [newTrip, ...state.history] }));
                return id;
            },
            removeTrip: (id) =>
                set((state) => ({
                    history: state.history.filter((trip) => trip.id !== id),
                    favorites: state.favorites.filter((favId) => favId !== id),
                })),
            toggleFavorite: (id) =>
                set((state) => ({
                    favorites: state.favorites.includes(id)
                        ? state.favorites.filter((favId) => favId !== id)
                        : [...state.favorites, id],
                })),
            clearHistory: () => set({ history: [], favorites: [] }),
        }),
        {
            name: 'travel-planner-storage',
        }
    )
);
