import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarClock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SchedulePage() {
    return (
        <div className="min-h-[80vh] w-full flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradient Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <Card className="border-white/20 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden relative ring-1 ring-black/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/5 dark:via-transparent dark:to-transparent pointer-events-none" />

                    <CardContent className="flex flex-col items-center text-center p-8 pt-12 relative z-10">
                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="mb-8 relative"
                        >
                            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-150 opacity-50" />
                            <div className="relative bg-gradient-to-br from-background to-muted p-5 rounded-3xl border border-white/20 shadow-xl">
                                <CalendarClock className="h-16 w-16 text-primary drop-shadow-sm" />
                            </div>
                        </motion.div>

                        <Badge variant="outline" className="mb-6 px-4 py-1.5 bg-primary/5 text-primary border-primary/20 text-sm font-medium rounded-full backdrop-blur-sm">
                            Em Breve
                        </Badge>

                        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tight">
                            Agenda Inteligente
                        </h1>

                        <p className="text-muted-foreground mb-10 leading-relaxed text-base">
                            Estamos finalizando os últimos detalhes da sua nova central de controle de recebimentos. Em breve, você terá previsibilidade total do seu caixa aqui.
                        </p>

                        <Button asChild size="lg" className="w-full h-12 text-base font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                            <Link to="/">
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Voltar ao Dashboard
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
