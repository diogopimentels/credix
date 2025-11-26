import { ClientsRepository } from '../repositories/ClientsRepository';
import { AppError } from '../../../shared/errors/AppError';

export class ShowClientService {
    constructor(private clientsRepository: ClientsRepository) { }

    async execute(id: string) {
        const client = await this.clientsRepository.findById(id);

        if (!client) {
            throw new AppError('Client not found', 404);
        }

        return client;
    }
}
