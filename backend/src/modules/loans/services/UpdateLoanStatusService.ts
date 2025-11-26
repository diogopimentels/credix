import { LoansRepository } from '../repositories/LoansRepository';
import { AppError } from '../../../shared/errors/AppError';
import { z } from 'zod';

const updateLoanStatusSchema = z.object({
    id: z.string().uuid(),
    status: z.enum(['pending', 'open', 'late', 'paid']),
});

type UpdateLoanStatusRequest = z.infer<typeof updateLoanStatusSchema>;

export class UpdateLoanStatusService {
    constructor(private loansRepository: LoansRepository) { }

    async execute({ id, status }: UpdateLoanStatusRequest) {
        const loanExists = await this.loansRepository.findById(id);

        if (!loanExists) {
            throw new AppError('Loan not found', 404);
        }

        const loan = await this.loansRepository.updateStatus(id, status);

        return loan;
    }
}
