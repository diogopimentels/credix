import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { MobileNav } from "./MobileNav"
import { DemoWelcomeModal } from "../common/DemoWelcomeModal"

export function Layout() {
    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <DemoWelcomeModal />
            {/* Sidebar - Hidden on mobile, visible on md+ */}
            <div className="hidden md:block w-64 flex-shrink-0">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>

                {/* Mobile Navigation - Visible on mobile only */}
                <MobileNav />
            </div>
        </div>
    )
}
