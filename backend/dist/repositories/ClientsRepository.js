"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsRepository = void 0;
const prisma_1 = require("../utils/prisma");
class ClientsRepository {
    async create(data) {
        const client = await prisma_1.prisma.client.create({
            data,
        });
        return client;
    }
    async findAll() {
        const clients = await prisma_1.prisma.client.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return clients;
    }
    async findById(id) {
        const client = await prisma_1.prisma.client.findUnique({
            where: {
                id,
            },
            include: {
                loans: true,
            },
        });
        return client;
    }
    async findByCpf(cpf) {
        const client = await prisma_1.prisma.client.findUnique({
            where: {
                cpf,
            },
        });
        return client;
    }
    async update(id, data) {
        const client = await prisma_1.prisma.client.update({
            where: {
                id,
            },
            data,
        });
        return client;
    }
}
exports.ClientsRepository = ClientsRepository;
