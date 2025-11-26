import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, LoanStatus } from "@/utils/calculations"
import { format } from "date-fns"
import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { getWhatsAppLink } from "@/utils/whatsapp"

interface RecentLoan {
    id: string
    clientName: string
    clientPhone?: string
    amount: number
    status: LoanStatus
    dueDate: string
    details: {
        totalAmount: number
    }
}

const getStatusLabel = (status: LoanStatus) => {
    switch (status) {
        case 'PAID': return 'Pago'
        case 'LATE': return 'Atrasado'
        case 'NEAR_DUE': return 'A Vencer'
        case 'DUE': return 'Vence Hoje'
        case 'ONGOING': return 'Em Andamento'
        default: return status
    }
}

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

export function RecentLoans({ loans }: { loans: RecentLoan[] }) {
    return (
        <Card className="col-span-3 border-muted/60 bg-card/50 backdrop-blur-sm shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Empréstimos Recentes</CardTitle>
                <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-primary">
                    <Link to="/loans">
                        Ver todos <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="pl-0">Cliente</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Vencimento</TableHead>
                                    <TableHead className="text-right pr-0">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loans.map((loan) => (
                                    <TableRow key={loan.id} className="group cursor-pointer hover:bg-muted/50 border-none">
                                        <TableCell className="font-medium group-hover:text-primary transition-colors pl-0 py-3">
                                            <div className="flex flex-col">
                                                <span>{loan.clientName}</span>
                                                <span className="text-xs text-muted-foreground font-normal">Ref: {loan.id.slice(0, 8)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{formatCurrency(loan.details.totalAmount)}</TableCell>
                                        <TableCell className="text-muted-foreground">{format(new Date(loan.dueDate), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell className="text-right pr-0">
                                            <div className="flex items-center justify-end gap-2">
                                                {(loan.status === 'NEAR_DUE' || loan.status === 'DUE' || loan.status === 'LATE') && loan.clientPhone && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 hover:bg-transparent"
                                                        title="Enviar cobrança via WhatsApp"
                                                        asChild
                                                    >
                                                        <a
                                                            href={getWhatsAppLink(loan.clientPhone, loan.clientName, loan.details.totalAmount, loan.dueDate)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <img src="/whatsapp.png" alt="WhatsApp" className="h-3.5 w-3.5 object-contain" />
                                                        </a>
                                                    </Button>
                                                )}
                                                <StatusBadge status={getStatusType(loan.status)}>
                                                    {getStatusLabel(loan.status)}
                                                </StatusBadge>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile List */}
                    <div className="md:hidden space-y-4">
                        {loans.map((loan) => (
                            <div key={loan.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{loan.clientName}</p>
                                    <p className="text-xs text-muted-foreground">{format(new Date(loan.dueDate), 'dd/MM/yyyy')}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="font-bold text-sm">{formatCurrency(loan.amount)}</span>
                                    <div className="flex items-center gap-2">
                                        {(loan.status === 'NEAR_DUE' || loan.status === 'DUE' || loan.status === 'LATE') && loan.clientPhone && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 hover:bg-transparent"
                                                title="Enviar cobrança via WhatsApp"
                                                asChild
                                            >
                                                <a
                                                    href={getWhatsAppLink(loan.clientPhone, loan.clientName, loan.details.totalAmount, loan.dueDate)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <img src="/whatsapp.png" alt="WhatsApp" className="h-3.5 w-3.5 object-contain" />
                                                </a>
                                            </Button>
                                        )}
                                        <StatusBadge status={getStatusType(loan.status)}>
                                            {getStatusLabel(loan.status)}
                                        </StatusBadge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
