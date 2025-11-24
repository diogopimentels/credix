import { useEffect, useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, LoanStatus } from "@/utils/calculations"
import { Download, FileText } from "lucide-react"
import { format, getMonth, getYear } from "date-fns"
import { PageHeader } from "@/components/ui/PageHeader"
import { EnhancedLoan } from "@/mocks/handlers"
import { StatusBadge } from "@/components/ui/StatusBadge"

const getStatusType = (status: LoanStatus): "success" | "warning" | "error" | "neutral" => {
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

export function CloseMonthPage() {
    const [month, setMonth] = useState<string>(new Date().getMonth().toString())
    const [year, setYear] = useState<string>(new Date().getFullYear().toString())
    const [loans, setLoans] = useState<EnhancedLoan[]>([])
    const [generatingPdf, setGeneratingPdf] = useState(false)

    useEffect(() => {
        fetch('/api/loans')
            .then(res => res.json())
            .then(data => {
                const filtered = data.filter((loan: EnhancedLoan) =>
                    getMonth(new Date(loan.startDate)) === parseInt(month) &&
                    getYear(new Date(loan.startDate)) === parseInt(year)
                );
                setLoans(filtered);
            });
    }, [month, year])

    const totalLent = loans.reduce((acc, loan) => acc + loan.amount, 0);
    const totalReceived = loans.filter(l => l.status === 'PAID').reduce((acc, l) => acc + l.totalAmount, 0);
    const totalInterest = loans.reduce((acc, l) => acc + l.interestAmount, 0);
    const totalFines = loans.reduce((acc, l) => acc + l.fineAmount, 0);


    const handleGeneratePDF = () => {
        setGeneratingPdf(true)
        // Simulate PDF generation
        setTimeout(() => {
            setGeneratingPdf(false)
            alert("Relatório PDF gerado com sucesso! (Simulação)")
        }, 2000)
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Fechamento do Mês"
                description="Relatório financeiro consolidado."
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Fechamento do Mês" }
                ]}
                actions={
                    <Button onClick={handleGeneratePDF} disabled={generatingPdf} className="shadow-lg shadow-primary/20">
                        <FileText className="mr-2 h-4 w-4" />
                        {generatingPdf ? "Gerando..." : "Gerar PDF"}
                    </Button>
                }
            />

            <div className="flex gap-4 p-4 bg-card/50 backdrop-blur-sm border rounded-lg">
                <div className="w-[180px]">
                    <Select value={month} onValueChange={setMonth}>
                        <SelectTrigger>
                            <SelectValue placeholder="Mês" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i} value={i.toString()}>
                                    {new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-[120px]">
                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger>
                            <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Emprestado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalLent)}</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Recebido</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalReceived)}</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Juros Gerados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalInterest)}</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-primary shadow-sm bg-primary/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Lucro Estimado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">
                            {formatCurrency(totalInterest + totalFines)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-muted/60 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-2 border-b bg-muted/20">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">Empréstimos do Mês</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent bg-muted/10">
                                <TableHead>Cliente</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loans.map(loan => (
                                <TableRow key={loan.id} className="hover:bg-muted/50">
                                    <TableCell>{loan.clientName}</TableCell>
                                    <TableCell>{format(new Date(loan.startDate), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell className="font-medium">{formatCurrency(loan.amount)}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={getStatusType(loan.status)}>
                                            {loan.status}
                                        </StatusBadge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
