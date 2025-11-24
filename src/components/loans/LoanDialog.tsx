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
import { Plus, Calculator } from "lucide-react"
import { useState, useEffect } from "react"
import { formatCurrency } from "@/utils/calculations"
import { Client } from "@/mocks/handlers"

export function LoanDialog({ onLoanAdded }: { onLoanAdded?: () => void }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [clients, setClients] = useState<Client[]>([])
    const [formData, setFormData] = useState({
        clientId: "",
        amount: "",
        termDays: "20",
        startDate: new Date().toISOString().split('T')[0]
    })

    useEffect(() => {
        if (open) {
            fetch('/api/clients')
                .then(res => res.json())
                .then(data => setClients(data))
        }
    }, [open])

    const calculateTotal = () => {
        const amount = parseFloat(formData.amount) || 0
        const interest = amount * 0.40
        return amount + interest
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            await fetch('/api/loans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount),
                    termDays: parseInt(formData.termDays)
                })
            })
            setOpen(false)
            setFormData({
                clientId: "",
                amount: "",
                termDays: "20",
                startDate: new Date().toISOString().split('T')[0]
            })
            if (onLoanAdded) onLoanAdded()
        } catch (error) {
            console.error("Failed to save loan", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Empréstimo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-white/10">
                <DialogHeader>
                    <DialogTitle>Novo Empréstimo</DialogTitle>
                    <DialogDescription>
                        Crie um novo empréstimo. Os juros são calculados automaticamente (40%).
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="client" className="text-right">
                            Cliente
                        </Label>
                        <Select
                            value={formData.clientId}
                            onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                        >
                            <SelectTrigger className="col-span-3 bg-background/50">
                                <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-white/10">
                                {clients.map(client => (
                                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Valor (R$)
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="1000.00"
                            className="col-span-3 bg-background/50"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Data Início
                        </Label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            className="col-span-3 bg-background/50"
                        />
                    </div>

                    {/* Calculation Preview */}
                    <div className="col-span-4 bg-muted/30 rounded-lg p-4 border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                            <Calculator className="h-4 w-4" />
                            Simulação
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Valor Principal:</span>
                            <span>{formatCurrency(parseFloat(formData.amount) || 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Juros (40%):</span>
                            <span className="text-destructive font-medium">
                                + {formatCurrency((parseFloat(formData.amount) || 0) * 0.40)}
                            </span>
                        </div>
                        <div className="border-t border-white/10 my-2 pt-2 flex justify-between font-bold text-lg">
                            <span>Total a Receber:</span>
                            <span className="text-primary">{formatCurrency(calculateTotal())}</span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave} disabled={loading || !formData.clientId || !formData.amount}>
                        {loading ? "Criando..." : "Criar Empréstimo"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
