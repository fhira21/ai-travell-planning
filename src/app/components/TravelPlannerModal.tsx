"use client";

import TravelPlanner from "./TravelPlanner";
import { X } from "lucide-react";

export default function TravelPlannerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* OVERLAY – background homepage tetap kelihatan */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow"
        >
          <X />
        </button>

        {/* FORM ASLI — TIDAK DIUBAH */}
        <TravelPlanner />
      </div>
    </div>
  );
}
