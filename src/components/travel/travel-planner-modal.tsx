"use client";

import * as React from "react";
import { X } from "lucide-react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function TravelPlannerModal({ open, onClose, children }: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* OVERLAY */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* MODAL CONTAINER */}
            <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-fade-in-up bg-background/95 backdrop-blur-3xl m-4">
                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
                >
                    <X className="w-5 h-5 text-foreground" />
                </button>

                {children}
            </div>
        </div>
    );
}
