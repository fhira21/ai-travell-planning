"use client";

import { useTravelStore } from "@/hooks/useTravelStore";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Calendar, Clock, Heart, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function FavoritesPage() {
    const { history, favorites, toggleFavorite, removeTrip } = useTravelStore();

    const favoriteTrips = history.filter(trip => favorites.includes(trip.id));

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Saved Trips</h1>
                    <p className="text-muted-foreground">Your starred itineraries ready for your next adventure.</p>
                </div>
            </div>

            {favoriteTrips.length === 0 ? (
                <div className="text-center py-20 glass-card rounded-3xl mt-8">
                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">No saved trips</h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        You haven't saved any trips yet. Star an itinerary from your history to see it here.
                    </p>
                    <Link href="/history">
                        <Button size="lg" className="rounded-full">View History</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {favoriteTrips.map((trip) => {
                        const { id, payload: input, result, createdAt } = trip;
                        const isFavorite = true;
                        const title = `Trip to ${input.transportation.to}`;
                        const dateStr = new Date(createdAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                        });
                        const days = input.trip.days;
                        const cost = result.metadata?.estimated_total_cost_idr?.total || 0;

                        return (
                            <Card key={id} className="glass-card hover:shadow-md transition-shadow overflow-hidden group border-primary/20">
                                <CardContent className="p-0">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                <MapPin className="w-3 h-3" />
                                                {input.transportation.to}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleFavorite(id);
                                                    }}
                                                    className="p-2 rounded-full hover:bg-muted transition-colors"
                                                >
                                                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        removeTrip(id);
                                                    }}
                                                    className="p-2 rounded-full hover:bg-destructive/10 text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <Link href={`/itinerary/${id}`}>
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>

                                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4" /> {dateStr}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" /> {days} Days
                                                </span>
                                            </div>

                                            <div className="pt-4 border-t flex items-center justify-between">
                                                <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {cost && cost !== "0" && cost !== "0 - 0" ? `Rp ${formatCurrency(cost)}` : "Cost pending"}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                                                    View details <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
