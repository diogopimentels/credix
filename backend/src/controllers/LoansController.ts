import { Request, Response } from 'express';
import { LoansService } from '../services/LoansService';
import { createLoanSchema, addPaymentSchema } from '../schemas';

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

    async show(request: Request, response: Response) {
        const { id } = request.params;
        const loan = await this.loansService.findById(id);
        return response.json(loan);
    }

    async addPayment(request: Request, response: Response) {
        const { id } = request.params;
        const data = addPaymentSchema.parse(request.body);
        const payment = await this.loansService.addPayment(id, data);
        return response.status(201).json(payment);
    }
// Legacy Express LoansController moved to `legacy-express` during NestJS migration.
// See: backend/legacy-express/src/controllers/LoansController.ts
export {}
