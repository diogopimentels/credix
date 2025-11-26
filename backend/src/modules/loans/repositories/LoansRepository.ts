import { prisma } from '../../../utils/prisma';
import { Prisma, Loan } from '@prisma/client';

export class LoansRepository {
    async create(data: Prisma.LoanCreateInput): Promise<Loan> {
        const loan = await prisma.loan.create({
            data,
        });
        return loan;
    }

    async findById(id: string): Promise<Loan | null> {
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

    async findAll(): Promise<Loan[]> {
        const loans = await prisma.loan.findMany({
            include: {
                client: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return loans;
    }

    async findByClientId(clientId: string): Promise<Loan[]> {
        const loans = await prisma.loan.findMany({
            where: {
                clientId,
            },
            include: {
                client: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return loans;
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
}
