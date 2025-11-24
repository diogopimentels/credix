import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Outlet } from "react-router-dom";

export function AppLayout() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/10 overflow-x-hidden">
            <Sidebar />

            <main className="md:pl-64 min-h-screen transition-all duration-300 ease-in-out overflow-x-hidden">
                <div className="container max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8 animate-fade-in">
                    <Outlet />
                </div>
            </main>

            <MobileNav />
        </div>
    );
}
