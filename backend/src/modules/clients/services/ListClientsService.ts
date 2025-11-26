import { ClientsRepository } from '../repositories/ClientsRepository';

export class ListClientsService {
    constructor(private clientsRepository: ClientsRepository) { }

    async execute() {
        const clients = await this.clientsRepository.findAll();
        return clients;
    }
}
