import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Wallet,
    Settings,
    LogOut,
    PieChart,
    Bell,
    CreditCard
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Clientes", href: "/clients" },
    { icon: Wallet, label: "Empréstimos", href: "/loans" },
    { icon: PieChart, label: "Relatórios", href: "/reports" },
    { icon: Settings, label: "Configurações", href: "/settings" },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-border/50">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/25 ring-1 ring-white/10">
                        <span className="text-white font-bold text-xl">C</span>
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

            <div className="mt-auto p-6 border-t border-border/50 bg-gradient-to-t from-background/50 to-transparent">
                <div className="flex items-center gap-3 mb-6 px-2 p-3 rounded-xl bg-secondary/50 border border-border/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-950 flex items-center justify-center ring-2 ring-border">
                        <span className="font-bold text-sm text-primary">AD</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">Admin User</p>
                        <p className="text-xs text-muted-foreground truncate">admin@credix.com</p>
                    </div>
                </div>
                <Button variant="outline" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/5 transition-all duration-300 group">
                    <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Sair
                </Button>
            </div>
        </div>
    );
}
