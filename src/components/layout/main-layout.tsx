import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
            <Navbar />
            <main className="flex-1 w-full relative">
                {/* Background Decorative Element */}
                <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                {children}
            </main>
            <Footer />
        </div>
    );
}
