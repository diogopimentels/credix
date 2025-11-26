import { prisma } from '../../src/utils/prisma';
import { Prisma, Loan, Payment } from '@prisma/client';

export type LoanWithRelations = Prisma.LoanGetPayload<{
    include: {
        client: true;
        payments: true;
    };
}>;

export class LoansRepository {
    async create(data: Prisma.LoanCreateInput): Promise<Loan> {
        const loan = await prisma.loan.create({
            data,
        });
        return loan;
    }

    async findAll(): Promise<LoanWithRelations[]> {
        const loans = await prisma.loan.findMany({
            include: {
                client: true,
                payments: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return loans;
    }

    async findById(id: string): Promise<LoanWithRelations | null> {
        const loan = await prisma.loan.findUnique({
            where: {
                id,
            },
            include: {
                client: true,
                payments: true,
            },
        });
        return loan;
    }

    async updateStatus(id: string, status: string): Promise<Loan> {
        const loan = await prisma.loan.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });
        return loan;
    }

    async addPayment(data: Prisma.PaymentCreateInput): Promise<Payment> {
        const payment = await prisma.payment.create({
            data,
        });
        return payment;
    }

    async getDashboardMetrics() {
        const totalLent = await prisma.loan.aggregate({
            _sum: {
                principal: true,
            },
        });

        const totalReceived = await prisma.payment.aggregate({
            _sum: {
                amount: true,
            },
        });

        const activeLoansCount = await prisma.loan.count({
            where: {
                status: {
                    in: ['open', 'late'],
                },
            },
        });

        const lateLoansCount = await prisma.loan.count({
            where: {
                status: 'late',
            },
        });

        return {
            totalLent: totalLent._sum.principal || 0,
            totalReceived: totalReceived._sum.amount || 0,
            activeLoansCount,
            lateLoansCount,
        };
    }
}
