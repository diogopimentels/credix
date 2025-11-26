import { Request, Response } from 'express';
import { LoansService } from '../../src/services/LoansService';
import { createLoanSchema } from '../../src/schemas';

export class LoansController {
    constructor(private loansService: LoansService) { }

    async create(request: Request, response: Response) {
        const data = createLoanSchema.parse(request.body);
        const loan = await this.loansService.create(data);
        return response.status(201).json(loan);
    }

    async index(request: Request, response: Response) {
        const loans = await this.loansService.findAll();
        return response.json(loans);
    }
}
