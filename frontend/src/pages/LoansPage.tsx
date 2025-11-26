import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
import { DollarSign, Filter, MoreHorizontal, Plus, Edit2, Calendar as CalendarIcon } from "lucide-react"
import { Loan } from "@/mocks/handlers"
import { fetchJson } from "@/lib/api"
import { PageHeader } from "@/components/ui/PageHeader"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { LoanDialog } from "@/components/loans/LoanDialog"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { format } from "date-fns"
import { LoanStatus } from "@/utils/calculations"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { getWhatsAppLink } from "@/utils/whatsapp"


// Enhanced Loan type from API response
interface EnhancedLoan extends Loan {
    clientName?: string
    clientPhone?: string
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
    const [selectedLoan, setSelectedLoan] = useState<Loan | undefined>(undefined)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const fetchLoans = () => {
        setLoading(true)
        fetchJson('/api/loans')
            .then(data => {
                setLoans(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to load loans:', err.message)
                setLoans([])
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchLoans()
    }, [])

    const handleEdit = (loan: Loan) => {
        setSelectedLoan(loan)
    }

    const handleDelete = (loan: Loan) => {
        setSelectedLoan(loan)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (selectedLoan) {
            try {
                const res = await fetch(`/api/loans/${selectedLoan.id}`, { method: 'DELETE' })
                if (!res.ok) {
                    throw new Error(`Delete failed ${res.status}`)
                }
            } catch (err) {
                console.error('Delete loan failed:', err)
            }
            setDeleteDialogOpen(false)
            fetchLoans()
        }
    }

    const filteredLoans = filter === "ALL"
        ? loans
        : loans.filter(loan => loan.status === filter)

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="space-y-8 pb-20">
            <PageHeader
                title="Empréstimos"
                description="Gerencie empréstimos, registre pagamentos e acompanhe vencimentos."
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Empréstimos" }
                ]}
                actions={
                    <LoanDialog onSave={fetchLoans} loan={selectedLoan}>
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5"
                            onClick={() => {
                                setSelectedLoan(undefined)
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Empréstimo
                        </Button>
                    </LoanDialog>
                }
            />

            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-lg border border-border/50 text-muted-foreground w-full sm:w-auto">
                    <Filter className="h-4 w-4" />
                    <span className="text-sm font-medium">Filtros:</span>
                </div>
                <div className="w-full sm:w-[200px]">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="bg-background/50 border-border/50 focus:ring-primary/20 transition-all duration-300 hover:bg-background/80">
                            <SelectValue placeholder="Filtrar por status" />
                        </SelectTrigger>
                        <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
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

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* DESKTOP TABLE VIEW (Hidden on Mobile) */}
                <div className="hidden md:block">
                    <Card className="border-black/5 dark:border-white/10 bg-card/50 backdrop-blur-xl shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                        <CardHeader className="pb-6 border-b border-black/5 dark:border-white/5">
                            <CardTitle className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                Gerenciar Empréstimos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-b border-black/5 dark:border-white/5 bg-muted/20 dark:bg-black/10">
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
                                            <TableRow key={i} className="border-b border-black/5 dark:border-white/5">
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
                                                    <div className="h-16 w-16 rounded-full bg-muted/30 dark:bg-black/20 flex items-center justify-center mb-4 ring-1 ring-black/5 dark:ring-white/10">
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
                                                className="group hover:bg-muted/30 dark:hover:bg-black/20 border-b border-black/5 dark:border-white/5 last:border-0 cursor-pointer transition-colors duration-200"
                                            >
                                                <TableCell className="font-medium group-hover:text-primary transition-colors duration-300 pl-6 py-4">
                                                    <Link to={`/clients/${loan.clientId}`}>{loan.clientName}</Link>
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
                                                    <div className="flex items-center justify-end gap-2">
                                                        {(loan.status === 'NEAR_DUE' || loan.status === 'DUE' || loan.status === 'LATE') && loan.clientPhone && (
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-colors"
                                                                title="Enviar cobrança via WhatsApp"
                                                                asChild
                                                            >
                                                                <a
                                                                    href={getWhatsAppLink(loan.clientPhone, loan.clientName || 'Cliente', loan.totalAmount, loan.dueDate)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <img src="/whatsapp.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
                                                                </a>
                                                            </Button>
                                                        )}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                                                                    <span className="sr-only">Abrir menu</span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-black/5 dark:border-white/10 shadow-xl">
                                                                <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                                                                    <Link to={`/loans/${loan.id}`}>Ver Detalhes</Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleEdit(loan)} className="cursor-pointer focus:bg-primary/10 focus:text-primary">Editar Empréstimo</DropdownMenuItem>
                                                                <DropdownMenuSeparator className="bg-border/50" />
                                                                <DropdownMenuItem onClick={() => handleDelete(loan)} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">Excluir Empréstimo</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* MOBILE CARD VIEW (Hidden on Desktop) */}
                <div className="md:hidden flex flex-col gap-4">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <Card key={i} className="border-black/5 dark:border-white/10 bg-card/50 backdrop-blur-xl">
                                <CardHeader className="pb-2">
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Skeleton className="h-10 w-full" />
                                </CardFooter>
                            </Card>
                        ))
                    ) : filteredLoans.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border">
                            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>Nenhum empréstimo encontrado</p>
                            <p className="text-xs mt-1 opacity-70">Tente alterar os filtros.</p>
                        </div>
                    ) : (
                        filteredLoans.map((loan) => (
                            <motion.div
                                key={loan.id}
                                variants={itemVariants}
                            >
                                <Card className="border-black/5 dark:border-white/10 bg-card/50 backdrop-blur-xl shadow-sm overflow-hidden">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="flex flex-col">
                                            <Link to={`/clients/${loan.clientId}`} className="font-bold text-base hover:text-primary transition-colors">
                                                {loan.clientName || "Cliente Desconhecido"}
                                            </Link>
                                        </div>
                                        <StatusBadge status={getStatusType(loan.status)}>
                                            {getStatusLabel(loan.status)}
                                        </StatusBadge>
                                    </CardHeader>
                                    <CardContent className="pb-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Valor</span>
                                                <span className="text-lg font-bold text-foreground">{formatCurrency(loan.totalAmount)}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Vencimento</span>
                                                <div className="flex items-center gap-1.5 text-sm font-medium">
                                                    <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {format(new Date(loan.dueDate), 'dd/MM/yyyy')}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex gap-2 pt-0">
                                        <Button
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                                            asChild
                                        >
                                            <Link to={`/loans/${loan.id}`}>
                                                Registrar Pagamento
                                            </Link>
                                        </Button>

                                        {loan.clientPhone && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="shrink-0 hover:bg-transparent"
                                                asChild
                                            >
                                                <a
                                                    href={getWhatsAppLink(loan.clientPhone, loan.clientName || 'Cliente', loan.totalAmount, loan.dueDate)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <img src="/whatsapp.png" alt="WhatsApp" className="w-8 h-8 object-contain" />
                                                </a>
                                            </Button>
                                        )}

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0 text-muted-foreground hover:text-primary"
                                            onClick={() => handleEdit(loan)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="w-[90vw] max-w-md rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Isso irá deletar permanentemente o empréstimo e todos os seus dados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Deletar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
