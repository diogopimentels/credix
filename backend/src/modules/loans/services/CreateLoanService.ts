import { LoansRepository } from '../repositories/LoansRepository';
import { ClientsRepository } from '../../clients/repositories/ClientsRepository';
import { AppError } from '../../../shared/errors/AppError';
import { z } from 'zod';

const createLoanSchema = z.object({
    clientId: z.string().uuid(),
    principal: z.number().positive(),
    dueDate: z.string().datetime(), // Expect ISO string
});

type CreateLoanRequest = z.infer<typeof createLoanSchema>;

export class CreateLoanService {
    constructor(
        private loansRepository: LoansRepository,
        private clientsRepository: ClientsRepository
    ) { }

    async execute({ clientId, principal, dueDate }: CreateLoanRequest) {
        const clientExists = await this.clientsRepository.findById(clientId);

        if (!clientExists) {
            throw new AppError('Client not found', 404);
        }

        const interestRate = 40; // 40%
        const totalAmount = principal * (1 + interestRate / 100);

        const loan = await this.loansRepository.create({
            client: {
                connect: { id: clientId },
            },
            principal,
            interestRate,
            totalAmount,
            dueDate: new Date(dueDate),
            status: 'pending',
        });

        return loan;
    }
}
