import { formatCurrency } from "@/utils/calculations";
import { Calculator } from "lucide-react";

interface SimulationBoxProps {
    amount: number;
    total: number;
    interestRate: number;
}

export function SimulationBox({ amount, total, interestRate }: SimulationBoxProps) {
    const interestAmount = amount * interestRate;

    return (
        <div className="rounded-lg p-4 bg-primary/5 border border-primary/10 shadow-inner space-y-3 transition-all duration-300">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary/90">
                <Calculator className="h-4 w-4" />
                <span>Simulação do Empréstimo</span>
            </div>
            <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center text-muted-foreground">
                    <span>Valor Principal</span>
                    <span className="font-medium text-foreground">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                    <span>Juros ({interestRate * 100}%)</span>
                    <span className="font-medium text-foreground">+ {formatCurrency(interestAmount)}</span>
                </div>
            </div>
            <div className="border-t border-primary/10 my-2" />
            <div className="flex justify-between items-center font-bold text-base">
                <span className="text-foreground">Total a Pagar</span>
                <span className="text-primary text-lg">{formatCurrency(total)}</span>
            </div>
        </div>
    );
}
