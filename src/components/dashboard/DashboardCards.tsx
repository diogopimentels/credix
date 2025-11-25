import { StatCard } from "@/components/dashboard/StatCard"
import { formatCurrency } from "@/utils/calculations"
import { Users, TrendingUp, AlertCircle, Wallet } from "lucide-react"

interface DashboardCardsProps {
    data: {
        totalLent: number
        totalReceived: number
        totalOpen: number
        totalLate: number
        totalInterest: number
        totalFines: number
    }
}

export function DashboardCards({ data }: DashboardCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full max-w-full overflow-hidden">
            <StatCard
                title="Total Emprestado"
                value={formatCurrency(data.totalLent)}
                icon={Wallet}
                description="Volume total movimentado"
                trend={{ value: 12, isPositive: true }}
                delay={0.1}
            />
            <StatCard
                title="Total Recebido"
                value={formatCurrency(data.totalReceived)}
                icon={TrendingUp}
                description="Retorno sobre capital"
                trend={{ value: 8, isPositive: true }}
                delay={0.2}
            />
            <StatCard
                title="Em Aberto"
                value={formatCurrency(data.totalOpen)}
                icon={Users}
                description="Valores a receber"
                delay={0.3}
            />
            <StatCard
                title="Em Atraso"
                value={formatCurrency(data.totalLate)}
                icon={AlertCircle}
                description="Atenção requerida"
                trend={{ value: 2, isPositive: false }}
                className="border-destructive/20 bg-destructive/5"
                delay={0.4}
            />
        </div>
    )
}
