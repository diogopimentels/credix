import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Outlet } from "react-router-dom";

export function AppLayout() {
    return (
        <div className="min-h-dvh bg-background font-sans text-foreground selection:bg-primary/10">
            <Sidebar />

            <main className="md:pl-64 min-h-dvh transition-all duration-300 ease-in-out">
                <div className="container max-w-7xl mx-auto px-4 md:p-8 pb-24 md:pb-8 animate-fade-in">
                    <Outlet />
                </div>
            </main>

            <MobileNav />
        </div>
    );
}
