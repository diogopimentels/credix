import { Request, Response } from 'express';
import { LoansRepository } from '../repositories/LoansRepository';
import { ClientsRepository } from '../../clients/repositories/ClientsRepository';
import { CreateLoanService } from '../services/CreateLoanService';
import { ListLoansService } from '../services/ListLoansService';
import { UpdateLoanStatusService } from '../services/UpdateLoanStatusService';
import { ShowLoanService } from '../services/ShowLoanService';

export class LoansController {
    async create(request: Request, response: Response) {
        const { clientId, principal, dueDate } = request.body;

        const loansRepository = new LoansRepository();
        const clientsRepository = new ClientsRepository();
        const createLoanService = new CreateLoanService(loansRepository, clientsRepository);

        const loan = await createLoanService.execute({
            clientId,
            principal,
            dueDate,
        });

        return response.status(201).json(loan);
    }

    async index(request: Request, response: Response) {
        const { clientId } = request.query;

        const loansRepository = new LoansRepository();
        const listLoansService = new ListLoansService(loansRepository);

        const loans = await listLoansService.execute(clientId as string);

        return response.json(loans);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const loansRepository = new LoansRepository();
        const showLoanService = new ShowLoanService(loansRepository);

        const loan = await showLoanService.execute(id);

        return response.json(loan);
    }

    async updateStatus(request: Request, response: Response) {
        const { id } = request.params;
        const { status } = request.body;

        const loansRepository = new LoansRepository();
        const updateLoanStatusService = new UpdateLoanStatusService(loansRepository);

        const loan = await updateLoanStatusService.execute({
            id,
            status,
        });

        return response.json(loan);
    }
}
