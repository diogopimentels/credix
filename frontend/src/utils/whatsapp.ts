import { formatCurrency } from "./calculations";

export function getWhatsAppLink(
    phone: string,
    clientName: string,
    amount: number,
    dueDate: string | Date
): string {
    // Remove non-numeric characters from phone
    const cleanPhone = phone.replace(/\D/g, "");

    // Format date
    const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const formattedDate = dateObj.toLocaleDateString('pt-BR');

    // Format amount
    const formattedAmount = formatCurrency(amount);

    const message = `Olá ${clientName}, passando para lembrar do vencimento do seu empréstimo de ${formattedAmount} previsto para ${formattedDate}.`;

    return `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
}
