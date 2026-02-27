"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, History, Heart } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

export function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Plan", icon: Compass },
        { href: "/history", label: "History", icon: History },
        { href: "/favorites", label: "Favorites", icon: Heart },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full glass border-b">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg">
                            <Compass className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gradient">TravelEase</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-1 bg-background/50 rounded-full p-1 border">
                            {links.map(({ href, label, icon: Icon }) => {
                                const isActive = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="h-8 w-px bg-border hidden md:block" />
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
}
