import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async pay(loanId: string, amount: number) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId }, include: { payments: true } })
    if (!loan) throw new NotFoundException('Loan not found')

    const payment = await this.prisma.payment.create({ data: { loanId, amount } })

    // update status if paid
    const paid = loan.payments.reduce((s, p) => s + p.amount, 0) + amount
    if (paid >= loan.total) {
      await this.prisma.loan.update({ where: { id: loanId }, data: { status: 'paid' } })
    }

    return payment
  }
}
