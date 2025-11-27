import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Printer } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PromissoryNoteDialogProps {
    loan: {
        clientName?: string;
        clientCpf?: string; // Assuming we might have this, or mock it
        totalAmount: number;
        dueDate: string;
        clientAddress?: string; // Mock if missing
    };
    children?: React.ReactNode;
}

export function PromissoryNoteDialog({ loan, children }: PromissoryNoteDialogProps) {

    const handlePrint = () => {
        window.print();
    };

    const formattedDate = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    const dueDate = format(new Date(loan.dueDate), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
    const value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(loan.totalAmount);

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <FileText className="w-4 h-4" />
                        Gerar Promissória
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Nota Promissória</DialogTitle>
                    <DialogDescription>
                        Visualize e imprima a nota promissória para assinatura.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-gray-100 p-8 rounded-lg overflow-auto flex justify-center">
                    {/* Visual Preview (Scaled down if needed, but here just standard) */}
                    <div
                        className="bg-white text-black p-12 shadow-lg w-[210mm] min-h-[297mm] font-serif relative print-only"
                        style={{ fontFamily: '"Times New Roman", Times, serif' }}
                    >
                        <div className="border-2 border-black h-full p-8 flex flex-col justify-between">

                            {/* Header */}
                            <div className="text-center space-y-4">
                                <h1 className="text-4xl font-bold uppercase tracking-widest border-b-2 border-black pb-4 inline-block">Nota Promissória</h1>
                                <div className="flex justify-end mt-8">
                                    <div className="border border-black p-2 px-4 text-xl font-bold">
                                        Valor: {value}
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="space-y-8 text-lg leading-relaxed text-justify mt-12">
                                <p>
                                    No dia <span className="font-bold">{dueDate}</span>, pagarei por esta única via de NOTA PROMISSÓRIA
                                    a <strong>{loan.clientName || "_______________________"}</strong>, CPF nº <strong>{loan.clientCpf || "___.___.___-__"}</strong>,
                                    ou à sua ordem, a quantia de <strong>{value}</strong> em moeda corrente deste país.
                                </p>
                                <p>
                                    Pagável em: __________________________________________________________________
                                </p>
                            </div>

                            {/* Footer / Signatures */}
                            <div className="mt-auto space-y-16">
                                <div className="text-right">
                                    <p>{formattedDate}.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-12">
                                    <div className="text-center space-y-2">
                                        <div className="border-t border-black w-2/3 mx-auto"></div>
                                        <p className="font-bold uppercase">{loan.clientName || "Nome do Cliente"}</p>
                                        <p className="text-sm">Emitente</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handlePrint} className="w-full sm:w-auto gap-2">
                        <Printer className="w-4 h-4" />
                        Imprimir / Salvar PDF
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
