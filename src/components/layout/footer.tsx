import { Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t glass mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span>Built with</span>
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                        <span>using Next.js & AI</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {new Date().getFullYear()} TravelEase. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
