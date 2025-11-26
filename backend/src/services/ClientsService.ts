import { ClientsRepository } from '../repositories/ClientsRepository';
import { createClientSchema, updateClientSchema } from '../schemas';
import { z } from 'zod';
import { AppError } from '../utils/AppError';

type CreateClientRequest = z.infer<typeof createClientSchema>;
type UpdateClientRequest = z.infer<typeof updateClientSchema>;

export class ClientsService {
    constructor(private clientsRepository: ClientsRepository) { }

    async create(data: CreateClientRequest) {
        const clientExists = data.cpf ? await this.clientsRepository.findByCpf(data.cpf) : null;

        if (clientExists) {
            throw new AppError('Client already exists with this CPF');
        }

        const client = await this.clientsRepository.create(data);
        return client;
    }

    async findAll() {
        return this.clientsRepository.findAll();
    }

    async findById(id: string) {
        const client = await this.clientsRepository.findById(id);

        if (!client) {
            throw new AppError('Client not found', 404);
        }

        return client;
    }

    async update(id: string, data: UpdateClientRequest) {
        const client = await this.clientsRepository.findById(id);

        if (!client) {
            throw new AppError('Client not found', 404);
        }

        return this.clientsRepository.update(id, data);
    }
}
