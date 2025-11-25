import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Wallet,
    Calendar, // Changed from Settings
    
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
    { icon: LayoutDashboard, label: "Início", href: "/dashboard" },
    { icon: Users, label: "Clientes", href: "/clients" },
    { icon: Wallet, label: "Empréstimos", href: "/loans" },
    { icon: Calendar, label: "Fechamento", href: "/close-month" }, // Changed to Close Month
];

export function MobileNav() {
    const location = useLocation();

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
            <nav className="bg-card/70 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/10 rounded-2xl p-2 flex justify-around items-center pointer-events-auto ring-1 ring-white/5">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                        <Link key={item.href} to={item.href} className="relative p-3 group">
                            {isActive && (
                                <motion.div
                                    layoutId="mobileActive"
                                    className="absolute inset-0 bg-primary/10 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className={cn(
                                "relative flex flex-col items-center gap-1 transition-all duration-300",
                                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                                <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
                                <span className={cn("text-xs", isActive ? "text-primary font-bold" : "text-muted-foreground")}>{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
