import { Request, Response } from 'express';
import { PaymentsRepository } from '../repositories/PaymentsRepository';
import { LoansRepository } from '../../loans/repositories/LoansRepository';
import { CreatePaymentService } from '../services/CreatePaymentService';

export class PaymentsController {
    async create(request: Request, response: Response) {
        const { loanId, amount } = request.body;

        const paymentsRepository = new PaymentsRepository();
        const loansRepository = new LoansRepository();
        const createPaymentService = new CreatePaymentService(paymentsRepository, loansRepository);

        const payment = await createPaymentService.execute({
            loanId,
            amount,
        });

        return response.status(201).json(payment);
    }
}
