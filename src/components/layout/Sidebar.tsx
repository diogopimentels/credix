import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Wallet,
    Calendar, // Changed from PieChart
    Settings,
    LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Clientes", href: "/clients" },
    { icon: Wallet, label: "Empréstimos", href: "/loans" },
    { icon: Calendar, label: "Fechamento Mensal", href: "/close-month" }, // Changed to Close Month
    // { icon: Settings, label: "Configurações", href: "/settings" }, // Removed Settings
];

export function Sidebar() {
    const location = useLocation();

    return (
        <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-border/50">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/25">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className="font-heading font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Credix
                    </span>
                </div>

                <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.href);
                        return (
                            <Link key={item.href} to={item.href}>
                                <div className="relative px-4 py-3 group rounded-xl overflow-hidden transition-all duration-300 hover:bg-primary/5">
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-primary/10 border-l-4 border-primary"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <div className={cn(
                                        "relative flex items-center gap-3 transition-all duration-300",
                                        isActive ? "text-primary font-semibold translate-x-1" : "text-muted-foreground group-hover:text-foreground group-hover:translate-x-1"
                                    )}>
                                        <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                                        <span>{item.label}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-4 border-t border-border/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-950 flex items-center justify-center ring-2 ring-background">
                        <span className="font-bold text-sm text-primary">AD</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">Admin User</p>
                        <p className="text-xs text-muted-foreground truncate">admin@credix.com</p>
                    </div>
                </div>
                <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors group">
                    <LogOut className="w-4 h-4 transition-transform group-hover:scale-90" />
                    Sair
                </Button>
            </div>
        </div>
    );
}
