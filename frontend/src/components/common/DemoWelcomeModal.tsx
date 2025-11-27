import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useProductTour } from "@/hooks/useProductTour";

export function DemoWelcomeModal() {
    const [open, setOpen] = useState(false);
    const { startTour } = useProductTour();

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
        if (!hasSeenWelcome) {
            setOpen(true);
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
        localStorage.setItem("hasSeenWelcome", "true");
        // Small delay to allow modal to close
        setTimeout(() => {
            startTour();
        }, 500);
    };

    const handleSeedData = () => {
        // Helper to get a date relative to today (at Noon to avoid timezone issues)
        const getRelativeDate = (daysOffset: number) => {
            const date = new Date();
            date.setDate(date.getDate() + daysOffset);
            date.setHours(12, 0, 0, 0); // Noon to be safe
            return date;
        };

        // Helper to calculate start date based on due date and term
        const getStartDate = (dueDaysOffset: number, termDays: number) => {
            const dueDate = getRelativeDate(dueDaysOffset);
            const startDate = new Date(dueDate);
            startDate.setDate(startDate.getDate() - termDays);
            return startDate.toISOString();
        };

        // Mock Seed Data
        const mockClients = [
            {
                id: "c-1",
                name: "João Silva",
                email: "joao@email.com",
                phone: "11999999999",
                status: "active",
                cpf: "123.456.789-00",
                address: "Rua Exemplo, 123",
                notes: "Cliente exemplar",
                createdAt: new Date().toISOString()
            },
            {
                id: "c-2",
                name: "Maria Oliveira",
                email: "maria@email.com",
                phone: "11988888888",
                status: "active",
                cpf: "987.654.321-00",
                address: "Av. Teste, 456",
                notes: "",
                createdAt: new Date().toISOString()
            },
            {
                id: "c-3",
                name: "Carlos Souza",
                email: "carlos@email.com",
                phone: "11977777777",
                status: "active",
                cpf: "111.222.333-44",
                address: "Rua das Flores, 789",
                notes: "Novo cliente",
                createdAt: new Date().toISOString()
            },
        ];

        const mockLoans = [
            // 1. Vence HOJE (0 dias)
            {
                id: "l-1",
                clientId: "c-1",
                amount: 1000,
                interestRate: 5,
                startDate: getStartDate(0, 30), // Vence hoje
                status: "active",
                termDays: 30,
                createdAt: new Date().toISOString(),
                paidDate: null
            },
            // 2. Venceu ONTEM (-1 dia) -> Atrasado
            {
                id: "l-2",
                clientId: "c-2",
                amount: 2000,
                interestRate: 5,
                startDate: getStartDate(-1, 30), // Venceu ontem
                status: "active",
                termDays: 30,
                createdAt: new Date().toISOString(),
                paidDate: null
            },
            // 3. Vence AMANHÃ (+1 dia) -> Futuro
            {
                id: "l-3",
                clientId: "c-1",
                amount: 1500,
                interestRate: 5,
                startDate: getStartDate(1, 30), // Vence amanhã
                status: "active",
                termDays: 30,
                createdAt: new Date().toISOString(),
                paidDate: null
            },
            // 4. Vence em 5 dias
            {
                id: "l-4",
                clientId: "c-3",
                amount: 3000,
                interestRate: 5,
                startDate: getStartDate(5, 30),
                status: "active",
                termDays: 30,
                createdAt: new Date().toISOString(),
                paidDate: null
            },
            // 5. Vence em 10 dias
            {
                id: "l-5",
                clientId: "c-2",
                amount: 5000,
                interestRate: 5,
                startDate: getStartDate(10, 30),
                status: "active",
                termDays: 30,
                createdAt: new Date().toISOString(),
                paidDate: null
            },
        ];

        const dbData = {
            clients: mockClients,
            loans: mockLoans
        };

        localStorage.setItem("credimestre-db", JSON.stringify(dbData));
        localStorage.setItem("startTour", "true");

        handleClose();
        window.location.reload();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[90vw] max-w-md rounded-2xl bg-card/80 backdrop-blur-xl border-white/10 shadow-2xl">
                <DialogHeader>
                    <div className="mx-auto w-fit mb-4">
                        <img
                            src="/logo.png"
                            alt="Logo CrediMestre"
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                    <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Bem-vindo ao Credix
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Este é um ambiente de demonstração. Todos os dados ficam salvos apenas no seu navegador.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="bg-muted/50 p-4 rounded-xl text-sm text-muted-foreground text-center">
                        <p>Você pode testar livremente. Seus dados reais não serão afetados.</p>
                    </div>
                </div>

                <DialogFooter className="flex-col gap-2 sm:gap-0">
                    <Button onClick={handleSeedData} className="w-full bg-primary hover:bg-primary/90 h-11 text-base shadow-lg shadow-primary/20">
                        Preencher com Dados de Teste
                    </Button>
                    <Button variant="ghost" onClick={handleClose} className="w-full mt-2">
                        Começar do Zero
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
