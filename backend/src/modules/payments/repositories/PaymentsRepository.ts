import { prisma } from '../../../utils/prisma';
import { Prisma, Payment } from '@prisma/client';

export class PaymentsRepository {
    async create(data: Prisma.PaymentCreateInput): Promise<Payment> {
        const payment = await prisma.payment.create({
            data,
        });
        return payment;
    }

    async findByLoanId(loanId: string): Promise<Payment[]> {
        const payments = await prisma.payment.findMany({
            where: {
                loanId,
            },
            orderBy: {
                date: 'desc',
            },
        });
        return payments;
    }
}
