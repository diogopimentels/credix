import { ClientsRepository } from '../repositories/ClientsRepository';
import { z } from 'zod';

const createClientSchema = z.object({
    name: z.string().min(3),
    phone: z.string(),
    address: z.string(),
    photoUrl: z.string().optional(),
});

type CreateClientRequest = z.infer<typeof createClientSchema>;

export class CreateClientService {
    constructor(private clientsRepository: ClientsRepository) { }

    async execute({ name, phone, address, photoUrl }: CreateClientRequest) {
        const client = await this.clientsRepository.create({
            name,
            phone,
            address,
            photoUrl,
        });

        return client;
    }
}
