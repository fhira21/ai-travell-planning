"use client";

import { useTravelPlanner } from "@/hooks/useTravelPlanner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTravelStore } from "@/hooks/useTravelStore";
import { generateItinerary } from "@/lib/ai";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import {
    Plane, Train, Bus, Ship, Car, Hotel, Compass,
    MapPin, Calendar, Heart, ChevronRight, ChevronLeft,
    Moon, Clock, Map, Building, DollarSign,
    Mountain, Umbrella, Coffee, ShoppingBag, Navigation, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const cityOptions = ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Denpasar", "Yogyakarta", "Malang", "Bali", "Lombok", "Labuan Bajo", "Raja Ampat", "Belitung", "Wakatobi", "Bromo", "Dieng", "Puncak"];
const transportOptions = ["Pesawat", "Kereta", "Bus", "Kapal", "Kendaraan Pribadi", "Rental Mobil"];
const stayTypeOptions = ["Hotel", "Villa", "Homestay", "Hostel", "Resort", "Apartment"];
const locationOptions = ["Pusat Kota", "Dekat Tempat Wisata", "Dekat Pantai", "Pegunungan", "Pinggiran Kota", "Dekat Stasiun/Bandara"];
const activityOptions = ["Alam", "Pantai", "Kuliner", "Budaya", "Belanja", "Petualangan", "Sejarah", "Religi"];
const paceOptions = ["Santai", "Normal", "Cepat"];

export function TravelPlannerForm() {
    const router = useRouter();
    const {
        step, nextStep, prevStep,
        transport, setTransport,
        stay, setStay,
        trip, setTrip,
        getPayload
    } = useTravelPlanner();

    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addTrip = useTravelStore(state => state.addTrip);

    const handleGenerate = async () => {
        try {
            setIsGenerating(true);
            setError(null);
            const payload = getPayload();

            const res = await generateItinerary(payload);

            if (!res.success || !res.data) {
                throw new Error(res.error || "Failed to generate itinerary");
            }

            // Save to store
            const tripId = addTrip(payload, res.data);

            // Navigate to results
            router.push(`/itinerary/${tripId}`);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center p-20 min-h-[500px] text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                    <Compass className="w-20 h-20 text-primary animate-spin-slow relative z-10" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                    Designing Your Journey
                </h2>
                <p className="text-muted-foreground text-lg max-w-md">
                    Our AI is exploring thousands of options to craft the perfect personalized itinerary for you...
                </p>
                <div className="mt-8 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary animate-bounce"></div>
                    <div className="w-3 h-3 rounded-full bg-primary animate-bounce delay-100"></div>
                    <div className="w-3 h-3 rounded-full bg-primary animate-bounce delay-200"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 w-full overflow-hidden">
            {/* Header & Progress */}
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-flex items-center gap-2">
                    <Compass className="w-8 h-8 text-primary" />
                    Plan Your Trip
                </h2>

                {/* Progress Bar Container */}
                <div className="mt-8 max-w-2xl mx-auto flex items-center justify-between relative px-2">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full hidden sm:block">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        />
                    </div>

                    {[
                        { s: 1, label: "Transport", icon: Plane },
                        { s: 2, label: "Stay", icon: Hotel },
                        { s: 3, label: "Activities", icon: Heart }
                    ].map((item) => {
                        const isActive = step === item.s;
                        const isDone = step > item.s;
                        return (
                            <div key={item.s} className="relative flex flex-col items-center gap-2 z-10 bg-background/50 sm:bg-transparent px-2">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm",
                                    isActive
                                        ? "bg-primary text-primary-foreground scale-110 shadow-md ring-4 ring-primary/20"
                                        : isDone
                                            ? "bg-secondary text-secondary-foreground"
                                            : "bg-muted text-muted-foreground"
                                )}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <span className={cn(
                                    "text-sm font-semibold transition-colors",
                                    isActive ? "text-primary" : isDone ? "text-secondary" : "text-muted-foreground"
                                )}>
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/50 text-center">
                    {error}
                </div>
            )}

            {/* Form Content Wrapper */}
            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            <div className="space-y-6">
                                <OptionGroup
                                    icon={MapPin} title="From"
                                    value={transport.from}
                                    options={cityOptions}
                                    onChange={(v) => setTransport({ ...transport, from: v })}
                                />
                                <OptionGroup
                                    icon={MapPin} title="To (Destination)"
                                    value={transport.to}
                                    options={cityOptions}
                                    onChange={(v) => setTransport({ ...transport, to: v })}
                                />
                            </div>
                            <div className="space-y-6">
                                <OptionGroup
                                    icon={Plane} title="Transport Mode"
                                    value={transport.mode}
                                    options={transportOptions}
                                    onChange={(v) => setTransport({ ...transport, mode: v })}
                                />
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                        <DollarSign className="w-4 h-4 text-primary" /> Transport Budget (IDR)
                                    </label>
                                    <Input
                                        placeholder="e.g. 500.000 - 1.000.000"
                                        value={transport.transportBudget}
                                        onChange={(e) => setTransport({ ...transport, transportBudget: e.target.value })}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            <div className="space-y-6">
                                <OptionGroup
                                    icon={Hotel} title="Accommodation Type"
                                    value={stay.stayType}
                                    options={stayTypeOptions}
                                    onChange={(v) => setStay({ ...stay, stayType: v })}
                                />
                                <OptionGroup
                                    icon={MapPin} title="Location Preference"
                                    value={stay.locationPreference}
                                    options={locationOptions}
                                    onChange={(v) => setStay({ ...stay, locationPreference: v })}
                                />
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                        <DollarSign className="w-4 h-4 text-primary" /> Budget per Night (IDR)
                                    </label>
                                    <Input
                                        placeholder="e.g. 250.000 - 500.000"
                                        value={stay.budgetPerNight}
                                        onChange={(e) => setStay({ ...stay, budgetPerNight: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-foreground">Nights</label>
                                        <NumberInput
                                            value={stay.nights}
                                            onChange={(v) => setStay({ ...stay, nights: v })}
                                            min={1}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-foreground">Guests</label>
                                        <NumberInput
                                            value={stay.guests}
                                            onChange={(v) => setStay({ ...stay, guests: v })}
                                            min={1}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                        <Heart className="w-4 h-4 text-primary" /> Travel Styles (Multiple)
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {activityOptions.map(opt => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => {
                                                    const has = trip.styles.includes(opt);
                                                    const next = has ? trip.styles.filter((s: string) => s !== opt) : [...trip.styles, opt];
                                                    setTrip({ ...trip, styles: next });
                                                }}
                                                className={cn(
                                                    "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                                    trip.styles.includes(opt)
                                                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                        : "bg-background hover:bg-muted border-input"
                                                )}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                        <Calendar className="w-4 h-4 text-primary" /> Total Days
                                    </label>
                                    <NumberInput
                                        value={trip.days}
                                        onChange={(v) => setTrip({ ...trip, days: v })}
                                        min={1}
                                    />
                                </div>
                                <OptionGroup
                                    icon={Clock} title="Travel Pace"
                                    value={trip.pace}
                                    options={paceOptions}
                                    onChange={(v) => setTrip({ ...trip, pace: v })}
                                />
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                        <DollarSign className="w-4 h-4 text-primary" /> Activity Budget / Day (IDR)
                                    </label>
                                    <Input
                                        placeholder="e.g. 100.000 - 300.000"
                                        value={trip.activityBudget}
                                        onChange={(e) => setTrip({ ...trip, activityBudget: e.target.value })}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="mt-12 pt-6 border-t flex items-center justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                    className="w-32"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                {step < 3 ? (
                    <Button type="button" onClick={nextStep} className="w-32">
                        Next <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button type="button" onClick={handleGenerate} className="w-48 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-white border-0 shadow-lg">
                        <Sparkles className="w-4 h-4 mr-2" /> Generate Itinerary
                    </Button>
                )}
            </div>
        </div>
    );
}

// Subcomponents for the form to keep it clean
interface OptionGroupProps {
    icon: React.ElementType;
    title: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}
function OptionGroup({ icon: Icon, title, value, options, onChange }: OptionGroupProps) {
    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <Icon className="w-4 h-4 text-primary" /> {title}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {options.map((opt: string) => (
                    <button
                        type="button"
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={cn(
                            "p-3 rounded-xl border text-sm font-medium transition-all",
                            value === opt
                                ? "bg-primary/10 border-primary text-primary shadow-sm"
                                : "bg-background hover:bg-muted border-input"
                        )}
                    >
                        {opt}
                    </button>
                ))}
                {/* Simple Input fallback if not in list */}
                {!options.includes(value) && value !== "" && (
                    <button
                        type="button"
                        className="p-3 rounded-xl border text-sm font-medium transition-all bg-primary/10 border-primary text-primary shadow-sm"
                    >
                        {value}
                    </button>
                )}
            </div>
            <Input
                placeholder="Or type custom..."
                value={options.includes(value) ? "" : value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-2"
            />
        </div>
    );
}

interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
    min: number;
}
function NumberInput({ value, onChange, min }: NumberInputProps) {
    return (
        <div className="flex items-center gap-1 bg-background border border-input rounded-xl p-1 shadow-sm">
            <button
                type="button"
                onClick={() => onChange(Math.max(min, value - 1))}
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-foreground"
            >
                -
            </button>
            <div className="flex-1 text-center font-bold text-lg">{value}</div>
            <button
                type="button"
                onClick={() => onChange(value + 1)}
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-foreground"
            >
                +
            </button>
        </div>
    );
}
