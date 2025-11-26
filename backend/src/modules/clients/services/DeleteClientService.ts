import { ClientsRepository } from '../repositories/ClientsRepository';
import { AppError } from '../../../shared/errors/AppError';

export class DeleteClientService {
    constructor(private clientsRepository: ClientsRepository) { }

    async execute(id: string) {
        const clientExists = await this.clientsRepository.findById(id);

        if (!clientExists) {
            throw new AppError('Client not found', 404);
        }

        await this.clientsRepository.delete(id);
    }
}
