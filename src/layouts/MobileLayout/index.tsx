import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface MobileLayoutProps {
    children?: ReactNode;
}

/**
 * Mobile-optimized layout with stable, overflow-safe design.
 * NO transforms, scale, or viewport-breaking animations.
 * Every container uses w-full max-w-full overflow-x-hidden.
 */
export function MobileLayout({ children }: MobileLayoutProps) {
    return (
        <div className="min-h-screen bg-background w-full max-w-full overflow-x-hidden">
            {/* Mobile Header - Fixed top */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
                <div className="flex items-center justify-between px-4 h-14">
                    <h1 className="text-lg font-bold">CrediMestre</h1>
                    {/* Theme toggle, notification, profile menu */}
                </div>
            </header>

            {/* Main content - padded for fixed header */}
            <main className="pt-14 pb-20 w-full max-w-full overflow-x-hidden">
                <div className="px-4 py-4 w-full max-w-full">
                    {children || <Outlet />}
                </div>
            </main>

            {/* Bottom Navigation - Fixed bottom */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t">
                <div className="flex items-center justify-around h-16 px-2">
                    {/* Dashboard, Loans, Clients, More icons */}
                </div>
            </nav>
        </div>
    );
}
