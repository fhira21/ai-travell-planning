"use client";

import { useState } from "react";
import { Plus, MapPin, Clock, Sparkles } from "lucide-react";
import TravelPlannerModal from "./components/TravelPlannerModal";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [openPlanner, setOpenPlanner] = useState(false);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-900 to-emerald-600 to-purple-500 p-6">
      {/* <main className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 relative overflow-hidden"> */}

      {/* Header */}
      <header className="max-w-6xl mx-auto text-white mb-10">
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
          ✨ AI Travel Planner
        </h1>
        <p className="mt-2 text-white/90 max-w-2xl">
          Discover popular travel plans, revisit your past itineraries, or create a new personalized journey with AI.
        </p>
      </header>

      {/* Content */}
      <section className="max-w-6xl mx-auto grid gap-10">
        {/* Popular Trips */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Popular This Month
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Bali 3 Days", "Yogyakarta Culture Trip", "Bandung Weekend", "Jakarta Culinary", "Lombok Nature"].map(
              (item) => (
                <div
                  key={item}
                  className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-5 shadow-lg text-white hover:scale-[1.02] transition"
                >
                  <h3 className="text-lg font-semibold mb-2">{item}</h3>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <MapPin className="w-4 h-4" /> Popular destination
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* History */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Your History
          </h2>
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg text-white">
            <p className="text-white/80">No itinerary history yet.</p>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <button
        onClick={() => setOpenPlanner(true)}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-lg"
                          style={{ background: "linear-gradient(135deg, #0EA5E9, #06B6D4)" }}

      >
        + Create New Itinerary
      </button>

      <TravelPlannerModal
        open={openPlanner}
        onClose={() => setOpenPlanner(false)}
      />

    </main>
  );
}

