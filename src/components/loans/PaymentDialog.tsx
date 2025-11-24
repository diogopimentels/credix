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
import { EnhancedLoan } from "@/mocks/handlers"
import { calculateLoanDetails } from "@/utils/calculations"
import { format } from "date-fns"
import { useState } from "react"

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value)
}

export function PaymentDialog({ loan, onSave, children }: { loan: EnhancedLoan, onSave: () => void, children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [paidDate, setPaidDate] = useState(format(new Date(), 'yyyy-MM-dd'))

    const loanDetails = calculateLoanDetails(loan.amount, loan.startDate, null, loan.termDays)

    const handleSave = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/loans/${loan.id}/pay`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paidDate })
            })
            if (!res.ok) throw new Error(`Payment request failed ${res.status}`)
            setOpen(false)
            onSave()
        } catch (error) {
            console.error("Failed to save payment", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-white/10">
                <DialogHeader>
                    <DialogTitle>Registrar Pagamento</DialogTitle>
                    <DialogDescription>
                        Confirme os detalhes do pagamento para quitar o empréstimo.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Cliente: <span className="font-medium text-foreground">{loan.clientName}</span></p>
                        <p className="text-sm text-muted-foreground">Valor Original: <span className="font-medium text-foreground">{formatCurrency(loan.amount)}</span></p>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4 border border-white/5 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Juros e Multas:</span>
                            <span className="font-medium">{formatCurrency(loanDetails.interestAmount + loanDetails.fineAmount)}</span>
                        </div>
                        <div className="border-t border-white/10 my-2 pt-2 flex justify-between font-bold text-lg">
                            <span>Valor Total do Pagamento:</span>
                            <span className="text-primary">{formatCurrency(loanDetails.totalAmount)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Data do Pagamento
                        </Label>
                        <Input
                            id="date"
                            type="date"
                            value={paidDate}
                            onChange={e => setPaidDate(e.target.value)}
                            className="col-span-3 bg-background/50"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave} disabled={loading}>
                        {loading ? "Registrando..." : "Confirmar Pagamento"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
