import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/authStore"
import { Menu, User, Bell, Search } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

interface HeaderProps {
    onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
    const { user, logout } = useAuthStore()

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 md:px-8 justify-between gap-4 max-w-full overflow-x-hidden">
                <div className="flex items-center gap-4 overflow-x-hidden">
                    <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/10 hover:text-primary flex-shrink-0" onClick={onMenuClick}>
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:flex items-center gap-2 rounded-md border border-border/60 bg-background/70 px-3 h-10 w-[clamp(12rem,30vw,20rem)] focus-within:border-primary/80 focus-within:ring-1 focus-within:ring-ring transition-all duration-300 max-w-full">
                        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <input
                            placeholder="Buscar..."
                            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none min-w-0"
                        />
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border whitespace-nowrap">⌘K</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-foreground">
                        <Search className="h-5 w-5" />
                    </Button>

                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
                    </Button>

                    <ModeToggle />

                    <div className="h-8 w-px bg-border/50 hidden md:block" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-border hover:ring-primary transition-all p-0 overflow-hidden flex-shrink-0">
                                <div className="h-full w-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-950 flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 max-w-[calc(100vw-2rem)]">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none truncate">{user?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">Perfil</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Configurações</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer bg-destructive/5 focus:bg-destructive/10" onClick={logout}>
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
