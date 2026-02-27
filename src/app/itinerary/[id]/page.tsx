"use client";

import { useTravelStore } from "@/hooks/useTravelStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
    MapPin, Calendar, Clock, DollarSign,
    Car, Train, Plane, Hotel, Navigation, Coffee,
    Share2, Heart, Download, Info, Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ItineraryResultPage() {
    const params = useParams();
    const router = useRouter();
    const tripId = params.id as string;
    const { history, favorites, toggleFavorite } = useTravelStore();
    const [tripData, setTripData] = useState<any>(null);

    useEffect(() => {
        if (tripId) {
            const data = history.find(t => t.id === tripId);
            if (data) {
                setTripData({
                    ...data,
                    isFavorite: favorites.includes(tripId)
                });
            } else {
                router.push("/");
            }
        }
    }, [tripId, history, favorites, router]);

    if (!tripData) return null; // Or a loading spinner

    const { payload: input, result, isFavorite } = tripData;
    const itinerary = result.itinerary || [];
    const meta = result.metadata || {};
    const transportOptions = meta.transportation_options || [];
    const accommodationOptions = meta.accommodation_options || [];

    const handleCopyToken = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>Destination: {input.transportation.to}</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Your Itinerary</h1>
                    <p className="text-muted-foreground flex items-center gap-4">
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {input.trip.days} Days</span>
                        <span className="flex items-center gap-1"><Hotel className="w-4 h-4" /> {input.accommodation.nights} Nights</span>
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => toggleFavorite(tripId)}>
                        <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                        {isFavorite ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyToken}>
                        <Share2 className="w-4 h-4" /> Share
                    </Button>
                    <Button size="sm" className="gap-2" onClick={handlePrint}>
                        <Download className="w-4 h-4" /> PDF
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content: Itinerary */}
                <div className="md:col-span-2 space-y-8">
                    {/* Transportation & Accommodation Options */}
                    {(transportOptions.length > 0 || accommodationOptions.length > 0) && (
                        <div className="grid sm:grid-cols-2 gap-6 mb-2">
                            {transportOptions.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Plane className="w-5 h-5 text-primary" /> Transport Options
                                    </h3>
                                    <div className="space-y-3">
                                        {transportOptions.map((opt: any) => (
                                            <div key={opt.id} className="glass-card p-5 rounded-2xl border border-primary/10 hover:-translate-y-1 transition-transform">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-semibold text-lg">{opt.name}</h4>
                                                        <span className="text-xs font-medium text-muted-foreground bg-secondary/10 px-2 py-1 rounded-md inline-block mt-1">{opt.type}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-emerald-600 dark:text-emerald-400">Rp {formatCurrency(opt.price)}</div>
                                                    </div>
                                                </div>
                                                {opt.description && <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{opt.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {accommodationOptions.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Hotel className="w-5 h-5 text-primary" /> Stays
                                    </h3>
                                    <div className="space-y-3">
                                        {accommodationOptions.map((opt: any) => (
                                            <div key={opt.id} className="glass-card p-5 rounded-2xl border border-primary/10 hover:-translate-y-1 transition-transform">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-semibold text-lg">{opt.name}</h4>
                                                        <span className="text-xs font-medium text-muted-foreground bg-secondary/10 px-2 py-1 rounded-md inline-block mt-1">{opt.type}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-emerald-600 dark:text-emerald-400">Rp {formatCurrency(opt.price_per_night)}</div>
                                                        <div className="text-xs text-muted-foreground font-normal">/night</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-foreground/80 mt-3 font-medium">
                                                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                                                    {opt.location}
                                                </div>
                                                {opt.description && <p className="text-sm text-foreground/70 mt-2 line-clamp-2">{opt.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {itinerary?.map((day: any, idx: number) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={day.day_number || idx}
                            className="space-y-4 relative pl-8 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent"
                        >
                            {/* Timeline Dot */}
                            <div className="absolute left-0 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center translate-x-0 md:translate-x-0 z-10 shadow-sm">
                                <span className="text-sm font-bold text-primary">{day.day_number}</span>
                            </div>

                            <div className="glass-card p-6 rounded-3xl ml-4">
                                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                    <span className="text-primary">Day {day.day_number}</span>
                                    <span className="text-muted-foreground text-sm font-normal">
                                        {day.theme && `— ${day.theme}`}
                                    </span>
                                </h3>

                                <div className="space-y-6 mt-6">
                                    {day.activities?.map((act: any, aIdx: number) => (
                                        <div key={aIdx} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className="text-sm font-medium text-muted-foreground w-16 text-right shrink-0">
                                                    {act.time}
                                                </div>
                                                <div className="h-full w-px bg-border group-last:hidden my-2"></div>
                                            </div>

                                            <div className="flex-1 pb-6 group-last:pb-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h4 className="font-semibold text-lg">{act.activity}</h4>
                                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                            {act.location && (
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="w-3.5 h-3.5" />
                                                                    {act.location}
                                                                </span>
                                                            )}
                                                            {act.duration && (
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3.5 h-3.5" />
                                                                    {act.duration}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {act.description && (
                                                            <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
                                                                {act.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {act.cost_estimate_idr && act.cost_estimate_idr !== "0" && act.cost_estimate_idr !== "0 - 0" && (
                                                        <div className="shrink-0 text-right">
                                                            <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md inline-block">
                                                                Rp {formatCurrency(act.cost_estimate_idr)}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {day.tips && (
                                    <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3 text-sm">
                                        <Info className="w-5 h-5 text-primary shrink-0" />
                                        <p className="text-primary/90">{day.tips}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Sidebar: Details & Budget */}
                <div className="space-y-6">
                    {/* Estimated Cost Summary */}
                    <Card className="glass-card shadow-sm border-0 sticky top-24">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-emerald-500" />
                                Budget Summary
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Plane className="w-4 h-4" /> Transport
                                    </span>
                                    <span className="font-medium text-foreground text-right w-1/2">
                                        Rp {formatCurrency(meta.estimated_total_cost_idr?.transportation || 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Hotel className="w-4 h-4" /> Accommodation
                                    </span>
                                    <span className="font-medium text-foreground text-right w-1/2">
                                        Rp {formatCurrency(meta.estimated_total_cost_idr?.accommodation || 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Navigation className="w-4 h-4" /> Activities & Food
                                    </span>
                                    <span className="font-medium text-foreground text-right w-1/2">
                                        Rp {formatCurrency(meta.estimated_total_cost_idr?.activities || 0)}
                                    </span>
                                </div>
                                {meta.estimated_total_cost_idr?.others && meta.estimated_total_cost_idr.others !== "0" && meta.estimated_total_cost_idr.others !== "0 - 0" && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Coffee className="w-4 h-4" /> Others (jajan, ojol)
                                        </span>
                                        <span className="font-medium text-foreground text-right w-1/2">
                                            Rp {formatCurrency(meta.estimated_total_cost_idr.others)}
                                        </span>
                                    </div>
                                )}

                                <div className="pt-4 border-t flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
                                    <span className="font-semibold text-foreground">Total Estimate</span>
                                    <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400 text-right w-full md:w-auto">
                                        Rp {formatCurrency(meta.estimated_total_cost_idr?.total || 0)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Integrated Map */}
                    <Card className="glass-card shadow-sm border-0 overflow-hidden">
                        <CardContent className="p-0 h-[300px] relative">
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(input.transportation.to)}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                            ></iframe>
                        </CardContent>
                    </Card>

                    {/* Quick Info */}
                    <Card className="glass-card shadow-sm border-0">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-4">Trip Details</h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground block mb-1">Pace</span>
                                    <span className="font-medium bg-secondary/10 text-secondary px-2 py-1 rounded-md">
                                        {input.trip.pace}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block mb-1">Focus Areas</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {input.trip?.styles?.map((s: string) => (
                                            <span key={s} className="bg-background border px-2 py-1 rounded-md text-xs font-medium">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-4 border-t">
                                    <span className="text-muted-foreground block mb-2">Estimated Weather</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                            <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">Mostly Sunny</div>
                                            <div className="text-sm text-muted-foreground">28°C - 32°C</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
