import {
    LayoutDashboard,
    Users,
    Wallet,
    Menu,
    Plus,
    Calendar,
    Calculator,
    LogOut,
    Trash2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { ClientDialog } from "@/components/clients/ClientDialog";
import { LoanDialog } from "@/components/loans/LoanDialog";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { handleResetData } from "@/utils/storage";
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

export function MobileNav() {
    const location = useLocation();
    const [fabOpen, setFabOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { logout } = useAuthStore();

    const navItems = [
        { icon: LayoutDashboard, label: "Início", href: "/dashboard" },
        { icon: Users, label: "Clientes", href: "/clients" },
        { icon: null, label: "Novo", href: "#", isFab: true },
        { icon: Wallet, label: "Empréstimos", href: "/loans" },
        { icon: Menu, label: "Menu", href: "#", isMenu: true },
    ];

    const menuItems = [
        { icon: Calculator, label: "Calculadora", href: "/calculator" },
        { icon: Calendar, label: "Fechamento Mensal", href: "/close-month" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-lg border-t border-border/50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]" />

            <div className="relative flex items-center justify-around h-16 px-2">
                {navItems.map((item, index) => {
                    if (item.isFab) {
                        return (
                            <div key={index} className="relative -top-6">
                                <Drawer open={fabOpen} onOpenChange={setFabOpen}>
                                    <DrawerTrigger asChild>
                                        <Button
                                            size="icon"
                                            className="h-14 w-14 rounded-full shadow-lg shadow-primary/30 bg-primary hover:bg-primary/90 transition-transform active:scale-95"
                                        >
                                            <Plus className="h-8 w-8 text-primary-foreground" />
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent className="bg-card/95 backdrop-blur-xl border-white/10">
                                        <DrawerHeader>
                                            <DrawerTitle>O que você deseja criar?</DrawerTitle>
                                        </DrawerHeader>
                                        <div className="p-4 space-y-3 pb-8">
                                            <ClientDialog onSave={() => setFabOpen(false)}>
                                                <Button variant="outline" className="w-full h-14 justify-start text-lg gap-3" onClick={() => { }}>
                                                    <Users className="h-5 w-5 text-primary" />
                                                    Novo Cliente
                                                </Button>
                                            </ClientDialog>

                                            <LoanDialog onSave={() => setFabOpen(false)}>
                                                <Button variant="outline" className="w-full h-14 justify-start text-lg gap-3" onClick={() => { }}>
                                                    <Wallet className="h-5 w-5 text-primary" />
                                                    Novo Empréstimo
                                                </Button>
                                            </LoanDialog>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        );
                    }

                    if (item.isMenu) {
                        const Icon = item.icon!;
                        return (
                            <Drawer key={index} open={menuOpen} onOpenChange={setMenuOpen}>
                                <DrawerTrigger asChild>
                                    <button
                                        className={cn(
                                            "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors active:scale-95 touch-manipulation text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="h-6 w-6" strokeWidth={2} />
                                        <span className="text-[10px] font-medium">{item.label}</span>
                                    </button>
                                </DrawerTrigger>
                                <DrawerContent className="bg-card/95 backdrop-blur-xl border-white/10">
                                    <DrawerHeader>
                                        <DrawerTitle>Menu</DrawerTitle>
                                    </DrawerHeader>
                                    <div className="p-4 space-y-2 pb-8">
                                        {menuItems.map((menuItem, idx) => (
                                            <Link
                                                key={idx}
                                                to={menuItem.href}
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                <Button variant="ghost" className="w-full justify-start h-12 text-base gap-3">
                                                    <menuItem.icon className="h-5 w-5 text-primary" />
                                                    {menuItem.label}
                                                </Button>
                                            </Link>
                                        ))}

                                        <div className="h-px bg-border/50 my-2" />

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start h-12 text-base gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-5 w-5" />
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
                                                    <AlertDialogAction onClick={() => {
                                                        setMenuOpen(false);
                                                        handleResetData();
                                                    }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                        Sim, limpar tudo
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start h-12 text-base gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => {
                                                setMenuOpen(false);
                                                logout();
                                            }}
                                        >
                                            <LogOut className="h-5 w-5" />
                                            Sair
                                        </Button>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        );
                    }

                    const isActive = location.pathname.startsWith(item.href);
                    const Icon = item.icon!;

                    return (
                        <Link
                            key={index}
                            to={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors active:scale-95 touch-manipulation",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-6 w-6 transition-all"
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
