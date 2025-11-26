import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Wallet,
    Calendar,
    LogOut,
    Calculator,
    Trash2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { handleResetData } from "@/utils/storage";
import { useAuthStore } from "@/store/authStore";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Clientes", href: "/clients" },
    { icon: Wallet, label: "Empréstimos", href: "/loans" },
    { icon: Calculator, label: "Calculadora", href: "/calculator" },
    { icon: Calendar, label: "Fechamento Mensal", href: "/close-month" },
];

export function Sidebar() {
    const location = useLocation();
    const { logout } = useAuthStore();

    return (
        <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-border/50">
            <div className="p-6">
                {/* LOGO SECTION START */}
                <div className="flex items-center justify-start gap-3 mb-8">
                    <img
                        src="/logo.png"
                        alt="Logo Credimestre"
                        className="h-12 w-auto object-contain drop-shadow-md"
                    />
                </div>
                {/* LOGO SECTION END */}

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
                        <p className="text-sm font-medium truncate">Usuário Admin</p>
                        <p className="text-xs text-muted-foreground truncate">admin@credix.com</p>
                    </div>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors group mb-2"
                        >
                            <Trash2 className="w-4 h-4 transition-transform group-hover:scale-90" />
                            Resetar Demo
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[90vw] max-w-md rounded-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Resetar todos os dados?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Isso apagará todos os clientes e empréstimos cadastrados neste navegador. Essa ação não pode ser desfeita.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleResetData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Sim, limpar tudo
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors group"
                    onClick={logout}
                >
                    <LogOut className="w-4 h-4 transition-transform group-hover:scale-90" />
                    Sair
                </Button>
            </div>
        </div>
    );
}