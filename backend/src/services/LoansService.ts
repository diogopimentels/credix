import { LoansRepository } from '../repositories/LoansRepository';
import { ClientsRepository } from '../repositories/ClientsRepository';
import { createLoanSchema, addPaymentSchema } from '../schemas';
import { z } from 'zod';
import { AppError } from '../utils/AppError';
import { isAfter } from 'date-fns';

type CreateLoanRequest = z.infer<typeof createLoanSchema>;
type AddPaymentRequest = z.infer<typeof addPaymentSchema>;

export class LoansService {
    constructor(
        private loansRepository: LoansRepository,
        private clientsRepository: ClientsRepository
    ) { }

    async create({ clientId, principal, dueDate }: CreateLoanRequest) {
        const client = await this.clientsRepository.findById(clientId);

        if (!client) {
            throw new AppError('Client not found', 404);
        }

        // Calculate interest (40%)
        const interestRate = 40;
        const totalAmount = principal * (1 + interestRate / 100);

        // Handle date format
        const parsedDueDate = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;

        const loan = await this.loansRepository.create({
            client: { connect: { id: clientId } },
            principal,
            interestRate,
            totalAmount,
            dueDate: parsedDueDate,
            status: 'open',
        });

        return loan;
    }

    async findAll() {
        const loans = await this.loansRepository.findAll();

        // Update status dynamically if needed (e.g. check for late loans)
        const now = new Date();
        const loansWithStatus = loans.map(loan => {
            let status = loan.status;
            if (status === 'open' && isAfter(now, loan.dueDate)) {
                status = 'late';
            }
            return { ...loan, status };
        });

        return loansWithStatus;
    }

    async findById(id: string) {
        const loan = await this.loansRepository.findById(id);

        if (!loan) {
            throw new AppError('Loan not found', 404);
        }

        return loan;
    }

    async addPayment(loanId: string, { amount }: AddPaymentRequest) {
        const loan = await this.loansRepository.findById(loanId);

        if (!loan) {
            throw new AppError('Loan not found', 404);
        }

        if (loan.status === 'paid') {
            throw new AppError('Loan is already paid');
        }

        const payment = await this.loansRepository.addPayment({
            loan: { connect: { id: loanId } },
            amount,
        });

        // Check if fully paid
        const totalPaid = loan.payments.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0) + amount;

        if (totalPaid >= Number(loan.totalAmount)) {
            await this.loansRepository.updateStatus(loanId, 'paid');
        }

        return payment;
    }
}
