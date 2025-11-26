import { LoansRepository } from '../repositories/LoansRepository';
import { AppError } from '../../../shared/errors/AppError';

export class ShowLoanService {
    constructor(private loansRepository: LoansRepository) { }

    async execute(id: string) {
        const loan = await this.loansRepository.findById(id);

        if (!loan) {
            throw new AppError('Loan not found', 404);
        }

        return loan;
    }
}
