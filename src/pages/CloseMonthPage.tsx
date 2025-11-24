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
import { formatCurrency } from "@/utils/calculations"
import { Download, FileText } from "lucide-react"
import { format } from "date-fns"
import { PageContainer } from "@/components/layout/PageContainer"

export function CloseMonthPage() {
    const [month, setMonth] = useState<string>(new Date().getMonth().toString())
    const [year, setYear] = useState<string>(new Date().getFullYear().toString())
    const [data, setData] = useState<any>(null)
    const [generatingPdf, setGeneratingPdf] = useState(false)

    const fetchData = async () => {
        try {
            const res = await fetch('/api/dashboard')
            const json = await res.json()
            setData(json)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [month, year])

    const handleExport = () => {
        if (!data) return
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Categoria,Valor\n"
            + `Total Emprestado,${data.totalLent}\n`
            + `Total Recebido,${data.totalReceived}\n`
            + `Juros Gerados,${data.totalInterest}\n`
            + `Multas,${data.totalFines}\n`

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `fechamento_${month}_${year}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleGeneratePDF = () => {
        setGeneratingPdf(true)
        // Simulate PDF generation
        setTimeout(() => {
            setGeneratingPdf(false)
            alert("Relatório PDF gerado com sucesso! (Simulação)")
        }, 2000)
    }

    return (
        <PageContainer>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fechamento do Mês</h1>
                    <p className="text-muted-foreground mt-1">Relatório financeiro consolidado.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={handleExport} className="flex-1 sm:flex-none">
                        <Download className="mr-2 h-4 w-4" />
                        CSV
                    </Button>
                    <Button onClick={handleGeneratePDF} disabled={generatingPdf} className="flex-1 sm:flex-none shadow-lg shadow-primary/20">
                        <FileText className="mr-2 h-4 w-4" />
                        {generatingPdf ? "Gerando..." : "Gerar PDF"}
                    </Button>
                </div>
            </div>

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

            {data && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-blue-500 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Emprestado</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(data.totalLent)}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Recebido</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(data.totalReceived)}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-orange-500 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Juros Gerados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(data.totalInterest)}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-primary shadow-sm bg-primary/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-primary">Lucro Estimado</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">
                                {formatCurrency(data.totalInterest + data.totalFines)}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card className="border-muted/60 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-2 border-b bg-muted/20">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">Detalhamento Contábil</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent bg-muted/10">
                                <TableHead>Data</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Mock rows for demonstration */}
                            <TableRow className="hover:bg-muted/50">
                                <TableCell>{format(new Date(), 'dd/MM/yyyy')}</TableCell>
                                <TableCell>Resumo Mensal Consolidado - Recebimentos</TableCell>
                                <TableCell className="font-medium">{data ? formatCurrency(data.totalReceived) : '...'}</TableCell>
                                <TableCell><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Fechado</span></TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-muted/50">
                                <TableCell>{format(new Date(), 'dd/MM/yyyy')}</TableCell>
                                <TableCell>Resumo Mensal Consolidado - Empréstimos</TableCell>
                                <TableCell className="font-medium">{data ? formatCurrency(data.totalLent) : '...'}</TableCell>
                                <TableCell><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Processado</span></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </PageContainer>
    )
}
