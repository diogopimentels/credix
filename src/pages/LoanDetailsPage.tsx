import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, Calendar, DollarSign, User } from "lucide-react"
import { Loan, Client } from "@/mocks/handlers"
import { formatCurrency, LoanStatus } from "@/utils/calculations"
import { format } from "date-fns"
import { PageHeader } from "@/components/ui/PageHeader"
import { fetchJson } from "@/lib/api"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { PaymentDialog } from "@/components/loans/PaymentDialog"

interface EnhancedLoanDetails extends Loan {
    client: Client
    status: LoanStatus
    initialAmount: number
    interestAmount: number
    fineAmount: number
    totalAmount: number
    daysLate: number
    dueDate: string
}

export function LoanDetailsPage() {
    const { id } = useParams()
    const [loan, setLoan] = useState<EnhancedLoanDetails | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchLoan = async () => {
        setLoading(true)
        try {
            const data = await fetchJson(`/api/loans/${id}`)
            setLoan(data)
        } catch (error: any) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLoan()
    }, [id])

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-24 w-full bg-muted rounded-xl" />
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    <div className="h-96 bg-muted rounded-xl" />
                    <div className="h-96 bg-muted rounded-xl" />
                </div>
            </div>
        )
    }

    if (!loan) return <div>Empréstimo não encontrado</div>

    const getStatusType = (status: LoanStatus): "success" | "warning" | "error" | "info" | "neutral" => {
        switch (status) {
            case 'PAID': return 'success'
            case 'LATE': return 'error'
            case 'NEAR_DUE': return 'warning'
            case 'DUE': return 'warning'
            case 'ONGOING': return 'info'
            default: return 'neutral'
        }
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Detalhes do Empréstimo"
                description={`ID: ${loan.id}`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Empréstimos", href: "/loans" },
                    { label: loan.id.slice(0, 8) }
                ]}
            />

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <Card className="h-full border-muted/60 bg-card/50 backdrop-blur-sm shadow-soft">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Informações do Cliente
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                            <div className="h-14 w-14 rounded-full overflow-hidden ring-2 ring-border/50">
                                <img src={loan.client?.photo} alt={loan.client?.name} className="h-full w-full object-cover" />
                            </div>
                            <div>
                                <Link to={`/clients/${loan.clientId}`} className="font-semibold hover:text-primary transition-colors text-lg">
                                    {loan.client?.name}
                                </Link>
                                <p className="text-sm text-muted-foreground">{loan.client?.phone}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1 p-3 rounded-lg bg-muted/20">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Data Início</span>
                                <div className="flex items-center gap-2 font-medium">
                                    <Calendar className="h-4 w-4 text-primary/70" />
                                    {format(new Date(loan.startDate), 'dd/MM/yyyy')}
                                </div>
                            </div>
                            <div className="space-y-1 p-3 rounded-lg bg-muted/20">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Vencimento</span>
                                <div className="flex items-center gap-2 font-medium">
                                    <Calendar className="h-4 w-4 text-primary/70" />
                                    {format(new Date(loan.dueDate), 'dd/MM/yyyy')}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Status Atual</span>
                            <div>
                                <StatusBadge status={getStatusType(loan.status)} className="px-3 py-1 text-sm">
                                    {loan.status}
                                </StatusBadge>
                            </div>
                        </div>

                        {loan.paidDate && (
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-700 dark:text-green-400">
                                <CheckCircle2 className="h-5 w-5" />
                                <div>
                                    <p className="font-medium">Empréstimo Quitado</p>
                                    <p className="text-xs opacity-90">Pago em {format(new Date(loan.paidDate), 'dd/MM/yyyy')}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="h-full border-muted/60 bg-card/50 backdrop-blur-sm shadow-soft flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            Demonstrativo Financeiro
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1">
                        <div className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/30 transition-colors">
                            <span className="text-muted-foreground">Valor Inicial</span>
                            <span className="font-medium text-lg">{formatCurrency(loan.initialAmount)}</span>
                        </div>

                        {loan.interestAmount > 0 && (
                            <div className="flex justify-between items-center p-3 rounded-lg bg-destructive/5 text-destructive border border-destructive/10">
                                <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Juros (40%)</span>
                                <span className="font-medium">+ {formatCurrency(loan.interestAmount)}</span>
                            </div>
                        )}

                        {loan.fineAmount > 0 && (
                            <div className="flex justify-between items-center p-3 rounded-lg bg-destructive/5 text-destructive border border-destructive/10">
                                <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Multa ({loan.daysLate} dias)</span>
                                <span className="font-medium">+ {formatCurrency(loan.fineAmount)}</span>
                            </div>
                        )}

                        <div className="mt-auto pt-6 border-t border-border/50">
                            <div className="flex justify-between items-end">
                                <span className="text-lg font-medium text-muted-foreground">Total a Pagar</span>
                                <span className="text-4xl font-bold text-primary tracking-tight">{formatCurrency(loan.totalAmount)}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-6">
                        {loan.status !== 'PAID' && (
                            <PaymentDialog loan={loan} onSave={fetchLoan}>
                                <Button className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300" size="lg">
                                    <CheckCircle2 className="mr-2 h-5 w-5" /> Registrar Pagamento
                                </Button>
                            </PaymentDialog>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
