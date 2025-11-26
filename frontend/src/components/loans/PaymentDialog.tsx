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
    const [isSuccess, setIsSuccess] = useState(false)

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
            setIsSuccess(true)
            onSave()
        } catch (error) {
            console.error("Failed to save payment", error)
            setLoading(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const handleClose = () => {
        setOpen(false)
        setIsSuccess(false)
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) handleClose()
            setOpen(val)
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-white/10 print:border-0 print:shadow-none print:bg-white print:text-black">
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center space-y-6 py-4 print:py-0">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center print:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-foreground print:text-black">Pagamento Confirmado!</h2>
                            <p className="text-muted-foreground print:text-gray-600">O pagamento foi registrado com sucesso.</p>
                        </div>

                        <div className="w-full bg-muted/30 border border-border/50 rounded-lg p-6 space-y-4 print:border-2 print:border-black print:bg-white">
                            <div className="flex flex-col items-center border-b border-border/50 pb-4 mb-4 print:border-black">
                                <span className="text-lg font-bold uppercase tracking-wider">Recibo de Pagamento</span>
                                <span className="text-xs text-muted-foreground print:text-black">{format(new Date(), 'dd/MM/yyyy HH:mm')}</span>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground print:text-black">Pagador:</span>
                                    <span className="font-medium">{loan.clientName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground print:text-black">Referência:</span>
                                    <span className="font-medium">Empréstimo #{loan.id.slice(0, 8)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground print:text-black">Data do Pagamento:</span>
                                    <span className="font-medium">{format(new Date(paidDate), 'dd/MM/yyyy')}</span>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-border/50 pt-4 mt-4 print:border-black">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-medium">Total Pago:</span>
                                    <span className="text-2xl font-bold text-primary print:text-black">{formatCurrency(loanDetails.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full print:hidden">
                            <Button variant="outline" className="flex-1" onClick={handlePrint}>
                                Imprimir Recibo
                            </Button>
                            <Button className="flex-1" onClick={handleClose}>
                                Fechar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
