import { useEffect, useState } from "react"
import { DashboardCards } from "@/components/dashboard/DashboardCards"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { RecentLoans } from "@/components/dashboard/RecentLoans"
import { AlertsSection } from "@/components/dashboard/AlertsSection"
import { PageHeader } from "@/components/ui/PageHeader"

export function DashboardPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/dashboard')
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-12 w-48 bg-muted rounded-lg" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-muted rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Dashboard"
                description="Visão geral da sua carteira de empréstimos e clientes."
                actions={
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Última atualização: Hoje, 14:30</span>
                    </div>
                }
            />

            <DashboardCards data={data} />

            <AlertsSection />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <RevenueChart data={data.revenueChartData} />
                </div>
                <div className="col-span-3">
                    <RecentLoans loans={data.recentLoans} />
                </div>
            </div>
        </div>
    )
}
