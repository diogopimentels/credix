"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoansRepository = void 0;
const prisma_1 = require("../utils/prisma");
class LoansRepository {
    async create(data) {
        const loan = await prisma_1.prisma.loan.create({
            data,
        });
        return loan;
    }
    async findAll() {
        const loans = await prisma_1.prisma.loan.findMany({
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
    async findById(id) {
        const loan = await prisma_1.prisma.loan.findUnique({
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
    async updateStatus(id, status) {
        const loan = await prisma_1.prisma.loan.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });
        return loan;
    }
    async addPayment(data) {
        const payment = await prisma_1.prisma.payment.create({
            data,
        });
        return payment;
    }
    async getDashboardMetrics() {
        const totalLent = await prisma_1.prisma.loan.aggregate({
            _sum: {
                principal: true,
            },
        });
        const totalReceived = await prisma_1.prisma.payment.aggregate({
            _sum: {
                amount: true,
            },
        });
        const activeLoansCount = await prisma_1.prisma.loan.count({
            where: {
                status: {
                    in: ['open', 'late'],
                },
            },
        });
        const lateLoansCount = await prisma_1.prisma.loan.count({
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
exports.LoansRepository = LoansRepository;
