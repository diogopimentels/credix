"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsController = void 0;
const schemas_1 = require("../schemas");
class ClientsController {
    constructor(clientsService) {
        this.clientsService = clientsService;
    }
    async create(request, response) {
        const data = schemas_1.createClientSchema.parse(request.body);
        const client = await this.clientsService.create(data);
        return response.status(201).json(client);
    }
    async index(request, response) {
        const clients = await this.clientsService.findAll();
        return response.json(clients);
    }
    async show(request, response) {
        const { id } = request.params;
        const client = await this.clientsService.findById(id);
        return response.json(client);
    }
    async update(request, response) {
        const { id } = request.params;
        const data = schemas_1.updateClientSchema.parse(request.body);
        const client = await this.clientsService.update(id, data);
        return response.json(client);
    }
}
exports.ClientsController = ClientsController;
