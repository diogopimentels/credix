"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsService = void 0;
const AppError_1 = require("../utils/AppError");
class ClientsService {
    constructor(clientsRepository) {
        this.clientsRepository = clientsRepository;
    }
    async create(data) {
        const clientExists = data.cpf ? await this.clientsRepository.findByCpf(data.cpf) : null;
        if (clientExists) {
            throw new AppError_1.AppError('Client already exists with this CPF');
        }
        const client = await this.clientsRepository.create(data);
        return client;
    }
    async findAll() {
        return this.clientsRepository.findAll();
    }
    async findById(id) {
        const client = await this.clientsRepository.findById(id);
        if (!client) {
            throw new AppError_1.AppError('Client not found', 404);
        }
        return client;
    }
    async update(id, data) {
        const client = await this.clientsRepository.findById(id);
        if (!client) {
            throw new AppError_1.AppError('Client not found', 404);
        }
        return this.clientsRepository.update(id, data);
    }
}
exports.ClientsService = ClientsService;
