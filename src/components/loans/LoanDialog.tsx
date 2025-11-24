import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { fetchJson } from "@/lib/api"
import { Client, Loan } from "@/mocks/handlers"
import { format } from "date-fns"
import { SimulationBox } from "./SimulationBox"

export function LoanDialog({ loan, onSave, children }: { loan?: Loan, onSave: () => void, children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [clients, setClients] = useState<Client[]>([])
    const [formData, setFormData] = useState({
        clientId: "",
        amount: "",
        termDays: "20",
        startDate: format(new Date(), 'yyyy-MM-dd')
    })

    useEffect(() => {
        if (open) {
            fetchJson('/api/clients')
                .then(data => setClients(data))
                .catch(err => {
                    console.error('Failed to load clients:', err.message)
                    setClients([])
                })
        }
    }, [open])

    useEffect(() => {
        if (loan) {
            setFormData({
                clientId: loan.clientId,
                amount: String(loan.amount),
                termDays: String(loan.termDays),
                startDate: format(new Date(loan.startDate), 'yyyy-MM-dd')
            })
        } else {
            setFormData({
                clientId: "",
                amount: "",
                termDays: "20",
                startDate: format(new Date(), 'yyyy-MM-dd')
            })
        }
    }, [loan, open])

    const principalAmount = parseFloat(formData.amount) || 0
    const interestRate = 0.40 // 40%
    const totalAmount = principalAmount * (1 + interestRate)

    const isFormValid = formData.clientId && principalAmount > 0 && formData.startDate && formData.termDays

    const handleSave = async () => {
        setLoading(true)
        const url = loan ? `/api/loans/${loan.id}` : '/api/loans'
        const method = loan ? 'PATCH' : 'POST'

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: principalAmount,
                    termDays: parseInt(formData.termDays)
                })
            })
            
            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(`Request failed with status ${res.status}: ${errorText}`)
            }
            
            const result = await res.json()
            console.log('Loan saved successfully:', result)
            setOpen(false)
            onSave()
        } catch (error) {
            console.error("Failed to save loan", error)
            alert(`Erro ao salvar empréstimo: ${error instanceof Error ? error.message : String(error)}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg p-0">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle>{loan ? "Editar Empréstimo" : "Novo Empréstimo"}</DialogTitle>
                    <DialogDescription>
                        {loan ? "Atualize os detalhes do empréstimo." : "Crie um novo empréstimo com juros de 40%."}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-5 px-6 pb-6 overflow-y-auto max-h-[70vh]">
                    <div className="space-y-2">
                        <Label htmlFor="client">Cliente</Label>
                        <Select
                            value={formData.clientId}
                            onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                            disabled={!!loan}
                        >
                            <SelectTrigger id="client">
                                <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map(client => (
                                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Valor (R$)</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="1000.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Data Início</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                    </div>
                    
                    {principalAmount > 0 &&
                        <SimulationBox amount={principalAmount} total={totalAmount} interestRate={interestRate} />
                    }

                </div>
                <DialogFooter className="bg-muted/30 p-6 flex flex-row sm:justify-between items-center">
                     <p className="text-sm text-muted-foreground hidden sm:block">Verifique os dados antes de salvar.</p>
                    <Button
                        type="submit"
                        onClick={handleSave}
                        disabled={loading || !isFormValid}
                        size="lg"
                        className="w-full sm:w-auto shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02]"
                    >
                        {loading ? "Salvando..." : (loan ? "Salvar Alterações" : "Criar Empréstimo")}
                        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
