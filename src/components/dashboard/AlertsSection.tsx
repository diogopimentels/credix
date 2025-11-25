import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, BellRing } from "lucide-react"
import { Link } from "react-router-dom"
import { formatCurrency } from "@/utils/calculations"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { fetchJson } from "@/lib/api"
import { useIsMobile } from "@/hooks/use-mobile"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
}

export function AlertsSection() {
    const [alerts, setAlerts] = useState<any[]>([])
    const isMobile = useIsMobile()

    useEffect(() => {
        fetchJson('/api/alerts')
            .then(data => setAlerts(data))
            .catch(err => {
                console.error('Failed to load alerts:', err.message)
                setAlerts([])
            })
    }, [])

    if (alerts.length === 0) return null

    return (
        <motion.div
            initial={isMobile ? {} : "hidden"}
            animate={isMobile ? {} : "visible"}
            variants={isMobile ? {} : containerVariants}
            className="max-w-full overflow-x-hidden"
        >
            <Card className="w-full border-destructive/20 bg-destructive/5 shadow-sm">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                        <BellRing className="h-5 w-5 text-destructive" />
                        <CardTitle className="text-lg font-semibold text-destructive">Alertas de Cobrança</CardTitle>
                    </div>
                    <Badge variant="destructive" className="ml-auto">
                        {alerts.length} pendências
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 mt-4">
                        {alerts.slice(0, 3).map((alert) => (
                            <motion.div
                                key={alert.id}
                                variants={isMobile ? {} : itemVariants}
                                className="flex flex-col sm:flex-row sm:items-center justify-between bg-background p-4 rounded-lg border shadow-sm gap-4 w-full max-w-full overflow-hidden"
                            >
                                <div className="flex items-center gap-4 min-w-0 w-full">
                                    <div className="p-2 bg-destructive/10 rounded-full shrink-0">
                                        <AlertTriangle className="h-4 w-4 text-destructive" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium truncate w-full">{alert.clientName || "Cliente"}</p>
                                        <p className="text-sm text-muted-foreground truncate w-full">
                                            Venceu em {format(new Date(alert.dueDate), 'dd/MM/yyyy')} • {alert.daysLate} dias de atraso
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                                    <div className="text-left sm:text-right">
                                        <p className="font-bold text-destructive">{formatCurrency(alert.totalAmount)}</p>
                                        <p className="text-xs text-muted-foreground">Valor atualizado</p>
                                    </div>
                                    <Button size="sm" variant="outline" asChild className="shrink-0">
                                        <Link to={`/loans/${alert.id}`}>Ver Detalhes</Link>
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                        {alerts.length > 3 && (
                            <Button variant="link" className="w-full text-muted-foreground" asChild>
                                <Link to="/loans">Ver todos os alertas</Link>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
