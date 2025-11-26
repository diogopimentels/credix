import { ClientsRepository } from '../repositories/ClientsRepository';
import { AppError } from '../../../shared/errors/AppError';
import { z } from 'zod';

const updateClientSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(3).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    photoUrl: z.string().optional(),
});

type UpdateClientRequest = z.infer<typeof updateClientSchema>;

export class UpdateClientService {
    constructor(private clientsRepository: ClientsRepository) { }

    async execute({ id, name, phone, address, photoUrl }: UpdateClientRequest) {
        const clientExists = await this.clientsRepository.findById(id);

        if (!clientExists) {
            throw new AppError('Client not found', 404);
        }

        const client = await this.clientsRepository.update(id, {
            name,
            phone,
            address,
            photoUrl,
        });

        return client;
    }
}
