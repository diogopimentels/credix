import { Request, Response } from 'express';
import { ClientsRepository } from '../repositories/ClientsRepository';
import { CreateClientService } from '../services/CreateClientService';
import { ListClientsService } from '../services/ListClientsService';
import { UpdateClientService } from '../services/UpdateClientService';
import { DeleteClientService } from '../services/DeleteClientService';
import { ShowClientService } from '../services/ShowClientService';

export class ClientsController {
    async create(request: Request, response: Response) {
        const { name, phone, address, photoUrl } = request.body;

        const clientsRepository = new ClientsRepository();
        const createClientService = new CreateClientService(clientsRepository);

        const client = await createClientService.execute({
            name,
            phone,
            address,
            photoUrl,
        });

        return response.status(201).json(client);
    }

    async index(request: Request, response: Response) {
        const clientsRepository = new ClientsRepository();
        const listClientsService = new ListClientsService(clientsRepository);

        const clients = await listClientsService.execute();

        return response.json(clients);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const clientsRepository = new ClientsRepository();
        const showClientService = new ShowClientService(clientsRepository);

        const client = await showClientService.execute(id);

        return response.json(client);
    }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { name, phone, address, photoUrl } = request.body;

        const clientsRepository = new ClientsRepository();
        const updateClientService = new UpdateClientService(clientsRepository);

        const client = await updateClientService.execute({
            id,
            name,
            phone,
            address,
            photoUrl,
        });

        return response.json(client);
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;

        const clientsRepository = new ClientsRepository();
        const deleteClientService = new DeleteClientService(clientsRepository);

        await deleteClientService.execute(id);

        return response.status(204).send();
    }
}
