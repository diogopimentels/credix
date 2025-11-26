import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator } from "lucide-react"
import { formatCurrency } from "@/utils/calculations"

export function LoanSimulatorCard() {
    const [amount, setAmount] = useState<string>("")
    const [termDays, setTermDays] = useState<string>("30")
    const [interest, setInterest] = useState<number>(0)
    const [total, setTotal] = useState<number>(0)

    useEffect(() => {
        const numAmount = parseFloat(amount) || 0
        const calcInterest = numAmount * 0.40
        setInterest(calcInterest)
        setTotal(numAmount + calcInterest)
    }, [amount])

    return (
        <Card className="border-muted/60 bg-card/50 backdrop-blur-sm shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Simulador Rápido</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="sim-amount">Valor a Emprestar</Label>
                    <Input
                        id="sim-amount"
                        type="number"
                        placeholder="0,00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-background/50"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sim-term">Prazo (Dias)</Label>
                    <Input
                        id="sim-term"
                        type="number"
                        value={termDays}
                        onChange={(e) => setTermDays(e.target.value)}
                        className="bg-background/50"
                    />
                </div>

                <div className="pt-2 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Juros (40%):</span>
                        <span className="font-medium text-orange-600">{formatCurrency(interest)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                        <span className="font-medium">Total a Receber:</span>
                        <span className="font-bold text-primary">{formatCurrency(total)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
