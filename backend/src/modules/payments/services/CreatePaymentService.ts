import { PaymentsRepository } from '../repositories/PaymentsRepository';
import { LoansRepository } from '../../loans/repositories/LoansRepository';
import { AppError } from '../../../shared/errors/AppError';
import { z } from 'zod';

const createPaymentSchema = z.object({
    loanId: z.string().uuid(),
    amount: z.number().positive(),
});

type CreatePaymentRequest = z.infer<typeof createPaymentSchema>;

export class CreatePaymentService {
    constructor(
        private paymentsRepository: PaymentsRepository,
        private loansRepository: LoansRepository
    ) { }

    async execute({ loanId, amount }: CreatePaymentRequest) {
        const loan = await this.loansRepository.findById(loanId);

        if (!loan) {
            throw new AppError('Loan not found', 404);
        }

        if (loan.status === 'paid') {
            throw new AppError('Loan is already paid');
        }

        const payment = await this.paymentsRepository.create({
            loan: {
                connect: { id: loanId },
            },
            amount,
        });

        // Check if loan is fully paid
        const payments = await this.paymentsRepository.findByLoanId(loanId);
        const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount), 0);

        if (totalPaid >= Number(loan.totalAmount)) {
            await this.loansRepository.updateStatus(loanId, 'paid');
        } else if (loan.status === 'pending') {
            await this.loansRepository.updateStatus(loanId, 'open');
        }

        return payment;
    }
}
