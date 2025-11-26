import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateLoanDto } from './dto/create-loan.dto'

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  // create loan with 40% interest
  async create(dto: CreateLoanDto) {
    const interest = dto.amount * 0.4
    const total = dto.amount + interest
    const loan = await this.prisma.loan.create({
      data: {
        clientId: dto.clientId,
        amount: dto.amount,
        interest,
        total,
        dueDate: new Date(dto.dueDate),
        status: 'open',
      },
    })
    return loan
  }

  async findAll() {
    return this.prisma.loan.findMany({ include: { payments: true, client: true } })
  }

  async findOne(id: string) {
    const loan = await this.prisma.loan.findUnique({ where: { id }, include: { payments: true } })
    if (!loan) throw new NotFoundException('Loan not found')
    return loan
  }

  async updateStatusIfPaid(loanId: string) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId }, include: { payments: true } })
    if (!loan) throw new NotFoundException('Loan not found')
    const paid = loan.payments.reduce((s, p) => s + p.amount, 0)
    if (paid >= loan.total) {
      return this.prisma.loan.update({ where: { id: loanId }, data: { status: 'paid' } })
    }
    return loan
  }
}
