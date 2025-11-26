import { prisma } from '../../src/utils/prisma';
import { Prisma, Client } from '@prisma/client';

export class ClientsRepository {
    async create(data: Prisma.ClientCreateInput): Promise<Client> {
        const client = await prisma.client.create({
            data,
        });
        return client;
    }

    async findAll(): Promise<Client[]> {
        const clients = await prisma.client.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return clients;
    }

    async findById(id: string): Promise<Client | null> {
        const client = await prisma.client.findUnique({
            where: {
                id,
            },
            include: {
                loans: true,
            },
        });
        return client;
    }

    async findByCpf(cpf: string): Promise<Client | null> {
        const client = await prisma.client.findUnique({
            where: {
                cpf,
            },
        });
        return client;
    }

    async update(id: string, data: Prisma.ClientUpdateInput): Promise<Client> {
        const client = await prisma.client.update({
            where: {
                id,
            },
            data,
        });
        return client;
    }
}
