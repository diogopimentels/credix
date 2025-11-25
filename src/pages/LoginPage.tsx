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
    const [email, setEmail] = useState("admin@credix.com")
    const [password, setPassword] = useState("admin")

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            const success = login(email, password)
            if (success) {
                navigate("/")
            } else {
                alert("Credenciais inválidas. Tente novamente.") // Basic feedback for failed login
            }
            setLoading(false)
        }, 1500)
    }

    return (
        <div className="min-h-dvh w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-black relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 dark:bg-primary/5 blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md px-4 relative z-10"
            >
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center justify-center gap-2 mb-4"
                    >
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/25">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Credix
                        </span>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-muted-foreground text-balance"
                    >
                        Bem-vindo de volta. Acesse sua conta para gerenciar suas finanças.
                    </motion.p>
                </div>

                <Card className="border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-2xl shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
                    <CardHeader className="space-y-1 pb-2">
                        <div className="flex justify-center mb-2">
                            <div className="h-1.5 w-14 rounded-full bg-primary/20" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@credix.com"
                                        className="pl-11 h-12 bg-white/50 dark:bg-black/30 border-gray-300/50 dark:border-gray-700/50 focus:border-primary/50 transition-all text-base"
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
                                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-11 h-12 bg-white/50 dark:bg-black/30 border-gray-300/50 dark:border-gray-700/50 focus:border-primary/50 transition-all text-base"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                <Button
                                    type="submit"
                                    className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Autenticando...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span>Entrar na Plataforma</span>
                                            <ArrowRight className="h-5 w-5" />
                                        </div>
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 bg-muted/10 dark:bg-black/10 pt-6 border-t border-black/5 dark:border-white/5">
                        <div className="text-center text-sm text-muted-foreground">
                            Não tem uma conta? <a href="#" className="text-primary font-medium hover:underline">Solicite um convite</a>
                        </div>
                        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/50">
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-green-500" /> SSL Seguro
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-green-500" /> Dados Criptografados
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
                    &copy; {new Date().getFullYear()} Credix Financial Systems. Todos os direitos reservados.
                </motion.div>
            </motion.div>
        </div>
    )
}
