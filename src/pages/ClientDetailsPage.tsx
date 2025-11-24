import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/PageHeader"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Phone, MapPin, FileText } from "lucide-react"
import { Client, Loan } from "@/mocks/handlers"
import { formatCurrency } from "@/utils/calculations"
import { format } from "date-fns"

interface ClientDetails extends Client {
    loans?: Loan[]
}

export function ClientDetailsPage() {
    const { id } = useParams()
    const [client, setClient] = useState<ClientDetails | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const res = await fetch(`/api/clients/${id}`)
                if (!res.ok) throw new Error('Client not found')
                const clientData = await res.json()

                const resLoans = await fetch('/api/loans')
                const loansData = await resLoans.json()
                const clientLoans = loansData.filter((l: any) => l.clientId === id)

                setClient({ ...clientData, loans: clientLoans })
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchClient()
    }, [id])

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="h-12 w-1/3 bg-muted rounded-lg animate-pulse mb-8" />
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-1 h-fit border-muted/60 bg-card/50 backdrop-blur-sm shadow-soft">
                        <CardHeader><div className="h-6 w-3/4 bg-muted rounded animate-pulse" /></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-center">
                                <div className="h-32 w-32 rounded-full bg-muted animate-pulse" />
                            </div>
                            <div className="space-y-4">
                                <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
                                <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
                                <div className="h-24 w-full bg-muted rounded-lg animate-pulse" />
                            </div>
                            <div className="h-12 w-full bg-muted rounded-lg animate-pulse" />
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2 border-muted/60 bg-card/50 backdrop-blur-sm shadow-soft">
                        <CardHeader><div className="h-6 w-1/2 bg-muted rounded animate-pulse" /></CardHeader>
                        <CardContent className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-2">
                                    <div>
                                        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                                        <div className="h-4 w-48 bg-muted rounded mt-2 animate-pulse" />
                                    </div>
                                    <div className="h-8 w-20 bg-muted rounded-full animate-pulse" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (!client) return <div>Cliente não encontrado</div>

    return (
        <div className="space-y-8">
            <PageHeader
                title={client.name}
                description="Detalhes do cliente e histórico de empréstimos."
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Clientes", href: "/clients" },
                    { label: client.name }
                ]}
            />

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1 border-muted/60 bg-card/50 backdrop-blur-sm shadow-soft h-fit">
                    <CardHeader>
                        <CardTitle>Dados do Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-center">
                            <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-border/50 shadow-lg">
                                <img src={client.photo} alt={client.name} className="h-full w-full object-cover" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/30">
                                <Phone className="h-4 w-4 text-primary" />
                                <span className="font-medium">{client.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/30">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="font-medium">{client.address}</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm p-3 rounded-lg bg-muted/30">
                                <FileText className="h-4 w-4 text-primary mt-1" />
                                <span className="text-muted-foreground leading-relaxed">{client.notes}</span>
                            </div>
                        </div>
                        <Button className="w-full shadow-lg shadow-primary/20">Novo Empréstimo</Button>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 border-muted/60 bg-card/50 backdrop-blur-sm shadow-soft">
                    <CardHeader>
                        <CardTitle>Histórico de Empréstimos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {client.loans?.map((loan: any) => (
                                <div key={loan.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0 hover:bg-muted/20 p-2 rounded-lg transition-colors">
                                    <div>
                                        <p className="font-bold text-lg">{formatCurrency(loan.amount)}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <span>{format(new Date(loan.startDate), 'dd/MM/yyyy')}</span>
                                            <span>→</span>
                                            <span>{format(new Date(loan.dueDate), 'dd/MM/yyyy')}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={
                                            loan.status === 'PAID' ? 'success' :
                                                loan.status === 'LATE' ? 'error' :
                                                    loan.status === 'ONGOING' ? 'info' : 'warning'
                                        }>
                                            {loan.status}
                                        </StatusBadge>
                                        <Button variant="outline" size="sm" asChild className="hover:border-primary/50 hover:bg-primary/5">
                                            <Link to={`/loans/${loan.id}`}>Ver</Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {(!client.loans || client.loans.length === 0) && (
                                <div className="text-center py-12">
                                    <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                                        <FileText className="h-6 w-6 opacity-50" />
                                    </div>
                                    <p className="text-muted-foreground font-medium">Nenhum empréstimo encontrado.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
