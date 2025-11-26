import { Router } from 'express';
import { ClientsController } from '../../src/controllers/ClientsController';
import { ClientsService } from '../../src/services/ClientsService';

const clientsRoutes = Router();

const clientsService = new ClientsService();
const clientsController = new ClientsController(clientsService);

clientsRoutes.post('/', (req, res) => clientsController.create(req, res));
clientsRoutes.get('/', (req, res) => clientsController.index(req, res));
clientsRoutes.get('/:id', (req, res) => clientsController.show(req, res));
clientsRoutes.patch('/:id', (req, res) => clientsController.update(req, res));

export { clientsRoutes };
