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

interface RecentLoan {
    id: string
    clientName: string
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

import { StatusBadge } from "@/components/ui/StatusBadge"

// ... (keep interfaces and helpers if needed, or import them)

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
            <CardContent className="p-0 md:p-6 w-full max-w-full overflow-hidden">
                <div className="space-y-8 w-full max-w-full">
                    {/* Desktop Table */}
                    <div className="hidden md:block w-full max-w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="pl-0 max-w-[120px] md:max-w-[200px] truncate">Cliente</TableHead>
                                    <TableHead>Valor</TableHead>
                                    <TableHead>Vencimento</TableHead>
                                    <TableHead className="text-right pr-0">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loans.map((loan) => (
                                    <TableRow key={loan.id} className="group cursor-pointer hover:bg-muted/50 border-none max-w-full">
                                        <TableCell className="font-medium group-hover:text-primary transition-colors pl-0 py-3 max-w-[120px] md:max-w-[200px] truncate">
                                            <div className="flex flex-col min-w-0">
                                                <span className="truncate">{loan.clientName}</span>
                                                <span className="text-xs text-muted-foreground font-normal truncate">Ref: {loan.id.slice(0, 8)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{formatCurrency(loan.details.totalAmount)}</TableCell>
                                        <TableCell className="text-muted-foreground">{format(new Date(loan.dueDate), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell className="text-right pr-0">
                                            <StatusBadge status={getStatusType(loan.status)}>
                                                {getStatusLabel(loan.status)}
                                            </StatusBadge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile List */}
                    <div className="md:hidden space-y-4 w-full max-w-full overflow-hidden px-4">
                        {loans.map((loan) => (
                            <div key={loan.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 w-full max-w-full overflow-hidden">
                                <div className="space-y-1 min-w-0">
                                    <p className="text-sm font-medium leading-none truncate">{loan.clientName}</p>
                                    <p className="text-xs text-muted-foreground truncate">{format(new Date(loan.dueDate), 'dd/MM/yyyy')}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <span className="font-bold text-sm">{formatCurrency(loan.amount)}</span>
                                    <StatusBadge status={getStatusType(loan.status)}>
                                        {getStatusLabel(loan.status)}
                                    </StatusBadge>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
