import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { motion } from "framer-motion"
import { CheckCircle2, ArrowRight, Lock, Mail } from "lucide-react"
import { useAuthStore } from "@/store/authStore"

export function LoginPage() {
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            login()
            setLoading(false)
            navigate("/")
        }, 1500)
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md px-4 relative z-10"
            >
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center justify-center gap-2 mb-4"
                    >
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/25">
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                        <span className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Credix
                        </span>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-muted-foreground text-balance"
                    >
                        Acesse seu painel financeiro premium.
                    </motion.p>
                </div>

                <Card className="border-white/10 bg-card/50 backdrop-blur-xl shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
                    <CardHeader className="space-y-1 pb-2">
                        <div className="flex justify-center mb-2">
                            <div className="h-1 w-12 rounded-full bg-primary/20" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@credix.com"
                                        className="pl-10 h-11 bg-background/50 border-muted-foreground/20 focus:border-primary/50 transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Senha</Label>
                                    <a href="#" className="text-xs text-primary hover:underline">Esqueceu a senha?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-10 h-11 bg-background/50 border-muted-foreground/20 focus:border-primary/50 transition-all"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Entrando...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>Entrar</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 bg-muted/20 pt-6 border-t border-border/50">
                        <div className="text-center text-sm text-muted-foreground">
                            Não tem uma conta? <a href="#" className="text-primary font-medium hover:underline">Solicite acesso</a>
                        </div>
                        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/50">
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Seguro
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Criptografado
                            </div>
                        </div>
                    </CardFooter>
                </Card>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-8 text-center text-xs text-muted-foreground/40"
                >
                    &copy; 2024 Credix Financial Systems. All rights reserved.
                </motion.div>
            </motion.div>
        </div>
    )
}
