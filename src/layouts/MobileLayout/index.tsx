import { ReactNode } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, FileText, Users, Menu } from 'lucide-react';

interface MobileLayoutProps {
    children?: ReactNode;
}

/**
 * Mobile-optimized layout with stable, overflow-safe design.
 * NO transforms, scale, or viewport-breaking animations.
 * Every container uses w-full max-w-full overflow-x-hidden.
 */
export function MobileLayout({ children }: MobileLayoutProps) {
    const location = useLocation();

    const isActive = (path: string) => location.pathname.includes(path);

    return (
        <div className="min-h-screen bg-background w-full max-w-full overflow-x-hidden">
            {/* Mobile Header - Fixed top */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b w-full max-w-full">
                <div className="flex items-center justify-between px-4 h-14 w-full max-w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">C</span>
                        </div>
                        <h1 className="text-lg font-bold truncate">CrediMestre</h1>
                    </div>
                    <button className="p-2 hover:bg-accent rounded-lg">
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* Main content - padded for fixed header/footer */}
            <main className="pt-14 pb-20 w-full max-w-full overflow-x-hidden min-h-screen">
                <div className="py-4 w-full max-w-full">
                    {children || <Outlet />}
                </div>
            </main>

            {/* Bottom Navigation - Fixed bottom */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t w-full max-w-full">
                <div className="flex items-center justify-around h-16 px-2 w-full max-w-full">
                    <Link
                        to="/dashboard"
                        className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg flex-1 ${isActive('dashboard') ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                            }`}
                    >
                        <Home className="h-5 w-5" />
                        <span className="text-xs font-medium">Início</span>
                    </Link>

                    <Link
                        to="/loans"
                        className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg flex-1 ${isActive('loans') ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                            }`}
                    >
                        <FileText className="h-5 w-5" />
                        <span className="text-xs font-medium">Empréstimos</span>
                    </Link>

                    <Link
                        to="/clients"
                        className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg flex-1 ${isActive('clients') ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                            }`}
                    >
                        <Users className="h-5 w-5" />
                        <span className="text-xs font-medium">Clientes</span>
                    </Link>

                    <Link
                        to="/close-month"
                        className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg flex-1 ${isActive('close-month') ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                            }`}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="text-xs font-medium">Mais</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
