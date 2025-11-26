import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Percent, Copy, Check } from "lucide-react"
import { formatCurrency } from "@/utils/calculations"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/PageHeader"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function CalculatorPage() {
    const [amount, setAmount] = useState<string>("")
    const [termDays, setTermDays] = useState<string>("30")
    const [interestRate, setInterestRate] = useState<string>("40")
    const [interest, setInterest] = useState<number>(0)
    const [total, setTotal] = useState<number>(0)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const numAmount = parseFloat(amount) || 0
        const rate = parseFloat(interestRate) || 0
        const calcInterest = numAmount * (rate / 100)
        setInterest(calcInterest)
        setTotal(numAmount + calcInterest)
    }, [amount, interestRate])

    const handleCopy = () => {
        const text = `Simulação de Empréstimo:\nValor: ${formatCurrency(parseFloat(amount) || 0)}\nPrazo: ${termDays} dias\nJuros: ${interestRate}%\nTotal a Pagar: ${formatCurrency(total)}`
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-6 pb-28">
            <PageHeader
                title="Calculadora"
                description="Simule condições de empréstimo."
                breadcrumbs={[
                    { label: "Dashboard", href: "/" },
                    { label: "Calculadora" }
                ]}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto"
            >
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-xl overflow-hidden">
                    <CardContent className="p-0">
                        {/* INPUT SECTION */}
                        <div className="p-6 space-y-6 bg-gradient-to-b from-background/50 to-background/80">
                            <div className="space-y-2 text-center">
                                <Label htmlFor="amount" className="text-muted-foreground uppercase tracking-wider text-xs font-semibold">
                                    Valor do Empréstimo
                                </Label>
                                <div className="relative flex items-center justify-center">
                                    <span className="text-2xl font-bold text-muted-foreground mr-1">R$</span>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0,00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="text-4xl font-bold text-center bg-transparent border-none shadow-none focus-visible:ring-0 p-0 h-auto placeholder:text-muted-foreground/30 w-full max-w-[200px]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="term" className="flex items-center justify-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                        <Calendar className="h-3 w-3" />
                                        Prazo (Dias)
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="term"
                                            type="number"
                                            value={termDays}
                                            onChange={(e) => setTermDays(e.target.value)}
                                            className="bg-muted/30 border-border/50 text-center font-semibold h-12 text-lg"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rate" className="flex items-center justify-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                        <Percent className="h-3 w-3" />
                                        Taxa (%)
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="rate"
                                            type="number"
                                            value={interestRate}
                                            onChange={(e) => setInterestRate(e.target.value)}
                                            className="bg-muted/30 border-border/50 text-center font-semibold h-12 text-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DIVIDER (Receipt Style) */}
                        <div className="relative h-4 bg-background">
                            <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-muted-foreground/20" />
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border border-muted-foreground/20" />
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border border-muted-foreground/20" />
                        </div>

                        {/* RESULT SECTION */}
                        <div className="p-6 bg-muted/10 space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Valor Solicitado</span>
                                    <span className="font-medium">{formatCurrency(parseFloat(amount) || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Juros ({interestRate}%)</span>
                                    <span className="font-medium text-orange-600">
                                        + {formatCurrency(interest)}
                                    </span>
                                </div>
                                <div className="pt-3 border-t border-dashed border-border/50 flex justify-between items-end">
                                    <span className="text-base font-bold text-muted-foreground">Total a Pagar</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {formatCurrency(total)}
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full h-12 border-dashed border-primary/30 hover:bg-primary/5 hover:border-primary/50 text-primary transition-all",
                                    copied && "bg-green-500/10 border-green-500/50 text-green-600 hover:bg-green-500/20 hover:border-green-500/60"
                                )}
                                onClick={handleCopy}
                                disabled={!amount}
                            >
                                {copied ? (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Copiado para área de transferência
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copiar Resumo da Simulação
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
