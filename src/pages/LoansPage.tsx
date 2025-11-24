import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DollarSign, Filter } from "lucide-react"
import { Loan } from "@/mocks/handlers"
import { PageHeader } from "@/components/ui/PageHeader"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { LoanDialog } from "@/components/loans/LoanDialog"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { format } from "date-fns"
import { LoanStatus } from "@/utils/calculations"

// Enhanced Loan type from API response
interface EnhancedLoan extends Loan {
    clientName?: string
    status: LoanStatus
    totalAmount: number
    dueDate: string
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)
}

const getStatusType = (status: string): "success" | "warning" | "error" | "neutral" => {
    switch (status) {
        case "PAID":
            return "success"
        case "ONGOING":
            return "neutral"
        case "NEAR_DUE":
        case "DUE":
            return "warning"
        case "LATE":
            return "error"
        default:
            return "neutral"
    }
}

const getStatusLabel = (status: string): string => {
    switch (status) {
        case "PAID":
            return "Pago"
        case "ONGOING":
            return "Em Andamento"
        case "NEAR_DUE":
            return "A Vencer"
        case "DUE":
            return "Vence Hoje"
        case "LATE":
            return "Atrasado"
        default:
            return status
    }
}

export function LoansPage() {
    const [loans, setLoans] = useState<EnhancedLoan[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("ALL")

    const fetchLoans = () => {
        setLoading(true)
        fetch('/api/loans')
            .then(res => res.json())
            .then(data => {
                setLoans(data)
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchLoans()
    }, [])

    const filteredLoans = filter === "ALL"
        ? loans
        : loans.filter(loan => loan.status === filter)

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
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Empréstimos"
                description="Gerencie empréstimos, registre pagamentos e acompanhe vencimentos."
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Empréstimos" }
                ]}
                actions={<LoanDialog onLoanAdded={fetchLoans} />}
            />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Card className="border-white/10 bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden ring-1 ring-white/5">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
                        <CardTitle className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Gerenciar Empréstimos
                        </CardTitle>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-lg border border-white/10 text-muted-foreground">
                                <Filter className="h-4 w-4" />
                                <span className="text-sm font-medium">Filtros:</span>
                            </div>
                            <div className="w-full sm:w-[200px]">
                                <Select value={filter} onValueChange={setFilter}>
                                    <SelectTrigger className="bg-background/50 border-white/10 focus:ring-primary/20 transition-all duration-300 hover:bg-background/80">
                                        <SelectValue placeholder="Filtrar por status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card/95 backdrop-blur-xl border-white/10">
                                        <SelectItem value="ALL">Todos</SelectItem>
                                        <SelectItem value="ONGOING">Em Andamento</SelectItem>
                                        <SelectItem value="NEAR_DUE">A Vencer</SelectItem>
                                        <SelectItem value="DUE">Vence Hoje</SelectItem>
                                        <SelectItem value="LATE">Atrasado</SelectItem>
                                        <SelectItem value="PAID">Pago</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b border-white/5 bg-muted/30">
                                    <TableHead className="pl-6">Cliente</TableHead>
                                    <TableHead>Valor Inicial</TableHead>
                                    <TableHead>Total Atual</TableHead>
                                    <TableHead>Vencimento</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i} className="border-b border-white/5">
                                            <TableCell className="pl-6"><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                            <TableCell className="pr-6"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredLoans.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-4 ring-1 ring-white/10">
                                                    <DollarSign className="h-8 w-8 opacity-50" />
                                                </div>
                                                <p className="font-medium text-lg text-foreground">Nenhum empréstimo encontrado</p>
                                                <p className="text-sm opacity-70 mt-1">Tente alterar os filtros ou adicione um novo empréstimo.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLoans.map((loan) => (
                                        <motion.tr
                                            key={loan.id}
                                            variants={itemVariants}
                                            className="group hover:bg-muted/40 border-b border-white/5 last:border-0 cursor-pointer transition-colors duration-200"
                                        >
                                            <TableCell className="font-medium group-hover:text-primary transition-colors duration-300 pl-6 py-4">
                                                {loan.clientName}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{formatCurrency(loan.amount)}</TableCell>
                                            <TableCell className="font-bold text-foreground">{formatCurrency(loan.totalAmount)}</TableCell>
                                            <TableCell className="text-muted-foreground">{format(new Date(loan.dueDate), 'dd/MM/yyyy')}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={getStatusType(loan.status)}>
                                                    {getStatusLabel(loan.status)}
                                                </StatusBadge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="outline" size="sm" asChild className="hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-300">
                                                    <Link to={`/loans/${loan.id}`}>Detalhes</Link>
                                                </Button>
                                            </TableCell>
                                        </motion.tr>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
