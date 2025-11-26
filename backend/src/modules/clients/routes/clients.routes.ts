import { Router } from 'express';
import { ClientsController } from '../controllers/ClientsController';
import { ensureAuthenticated } from '../../../shared/infra/http/middlewares/ensureAuthenticated';

const clientsRouter = Router();
const clientsController = new ClientsController();

clientsRouter.use(ensureAuthenticated);

clientsRouter.post('/', clientsController.create);
clientsRouter.get('/', clientsController.index);
clientsRouter.get('/:id', clientsController.show);
clientsRouter.put('/:id', clientsController.update);
clientsRouter.delete('/:id', clientsController.delete);

export { clientsRouter };
