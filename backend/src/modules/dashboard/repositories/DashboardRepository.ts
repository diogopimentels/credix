import { prisma } from '../../../utils/prisma';

export class DashboardRepository {
    async getSummary() {
        const totalLoans = await prisma.loan.aggregate({
            _sum: {
                principal: true,
                totalAmount: true,
            },
            _count: {
                id: true,
            },
        });

        const totalPayments = await prisma.payment.aggregate({
            _sum: {
                amount: true,
            },
        });

        const openLoans = await prisma.loan.count({
            where: {
                status: {
                    in: ['open', 'pending'],
                },
            },
        });

        const lateLoans = await prisma.loan.count({
            where: {
                status: 'late',
            },
        });

        const totalClients = await prisma.client.count();

        const lastUpdate = await prisma.loan.findFirst({
            orderBy: {
                updatedAt: 'desc',
            },
            select: {
                updatedAt: true,
            },
        });

        return {
            totalLent: totalLoans._sum.principal || 0,
            totalExpected: totalLoans._sum.totalAmount || 0,
            totalReceived: totalPayments._sum.amount || 0,
            openLoansCount: openLoans,
            lateLoansCount: lateLoans,
            totalClients,
            lastUpdate: lastUpdate?.updatedAt || new Date(),
        };
    }
}
