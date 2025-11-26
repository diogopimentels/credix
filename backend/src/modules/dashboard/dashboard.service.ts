import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async totals() {
    const totalLoans = await this.prisma.loan.aggregate({ _sum: { total: true } })
    const totalPayments = await this.prisma.payment.aggregate({ _sum: { amount: true } })
    const openLoans = await this.prisma.loan.count({ where: { status: 'open' } })
    const paidLoans = await this.prisma.loan.count({ where: { status: 'paid' } })

    return {
      totalLoans: totalLoans._sum.total ?? 0,
      totalPayments: totalPayments._sum.amount ?? 0,
      openLoans,
      paidLoans,
    }
  }

  async fechamentoMensal(year: number, month: number) {
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 1)
    const loans = await this.prisma.loan.findMany({ where: { createdAt: { gte: start, lt: end } } })
    const payments = await this.prisma.payment.findMany({ where: { paidAt: { gte: start, lt: end } } })
    const totalLoans = loans.reduce((s, l) => s + l.total, 0)
    const totalPayments = payments.reduce((s, p) => s + p.amount, 0)
    return { totalLoans, totalPayments, loansCount: loans.length, paymentsCount: payments.length }
  }
}
