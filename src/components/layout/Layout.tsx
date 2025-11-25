import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="min-h-screen bg-background flex relative overflow-x-hidden max-w-full">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px]" />
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-[clamp(14rem,18vw,20rem)] border-r border-border/40 bg-card/30 backdrop-blur-xl fixed inset-y-0 z-30">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-[clamp(14rem,70vw,20rem)] border-r border-border/40 bg-card/95 backdrop-blur-xl">
                    <Sidebar />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:pl-[clamp(14rem,18vw,20rem)] min-h-screen transition-all duration-300 relative z-10 max-w-full">
                <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
                <main className="flex-1 overflow-x-hidden p-4 md:p-8 max-w-full">
                    <div className="max-w-full overflow-x-hidden">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
