import { Request, Response } from 'express';
import { ClientsService } from '../../src/services/ClientsService';
import { createClientSchema, updateClientSchema } from '../../src/schemas';

export class ClientsController {
    constructor(private clientsService: ClientsService) { }

    async create(request: Request, response: Response) {
        const data = createClientSchema.parse(request.body);
        const client = await this.clientsService.create(data);
        return response.status(201).json(client);
    }

    async index(request: Request, response: Response) {
        const clients = await this.clientsService.findAll();
        return response.json(clients);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;
        const client = await this.clientsService.findById(id);
        return response.json(client);
    }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const data = updateClientSchema.parse(request.body);
        const client = await this.clientsService.update(id, data);
        return response.json(client);
    }
}
