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
import { Sparkles } from "lucide-react";

export function DemoWelcomeModal() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
        if (!hasSeenWelcome) {
            setOpen(true);
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
        localStorage.setItem("hasSeenWelcome", "true");
    };

    const handleSeedData = () => {
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
        ];

        const mockLoans = [
            {
                id: "l-1",
                clientId: "c-1",
                amount: 5000,
                interestRate: 5,
                startDate: new Date().toISOString(),
                status: "active",
                termDays: 30,
                createdAt: new Date().toISOString(),
                paidDate: null
            },
            {
                id: "l-2",
                clientId: "c-2",
                amount: 10000,
                interestRate: 4,
                startDate: new Date().toISOString(),
                status: "active",
                termDays: 60,
                createdAt: new Date().toISOString(),
                paidDate: null
            },
        ];

        const dbData = {
            clients: mockClients,
            loans: mockLoans
        };

        localStorage.setItem("credimestre-db", JSON.stringify(dbData));

        handleClose();
        window.location.reload();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-[90vw] max-w-md rounded-2xl bg-card/80 backdrop-blur-xl border-white/10 shadow-2xl">
                <DialogHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                        <img
                            src="/logo.png"
                            alt="Logo CrediMestre"
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                    <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Bem-vindo ao CrediMestre
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
                        <Sparkles className="w-4 h-4 mr-2" />
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
