import { useEffect, useState } from "react"
import { DashboardCards } from "@/components/dashboard/DashboardCards"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { RecentLoans } from "@/components/dashboard/RecentLoans"
import { AlertsSection } from "@/components/dashboard/AlertsSection"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import { PageHeader } from "@/components/ui/PageHeader"
import { fetchJson } from "@/lib/api"

export function DashboardPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchJson('/api/dashboard')
            .then(d => {
                setData(d)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-muted-foreground">Carregando Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <div>No data</div>;
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Dashboard"
                description="Visão geral da sua carteira de empréstimos e clientes."
                actions={
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground mr-2">Última atualização: Hoje, 14:30</span>
                        <Button id="tour-step-2" size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Novo Empréstimo
                        </Button>
                    </div>
                }
            />

            <DashboardCards data={data} />

            <AlertsSection />

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
                <div className="lg:col-span-4">
                    <RevenueChart data={data.revenueChartData} />
                </div>
                <div className="lg:col-span-3">
                    <RecentLoans loans={data.recentLoans} />
                </div>
            </div>
        </div>
    )
}
