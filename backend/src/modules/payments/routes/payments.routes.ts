import { Router } from 'express';
import { PaymentsController } from '../controllers/PaymentsController';
import { ensureAuthenticated } from '../../../shared/infra/http/middlewares/ensureAuthenticated';

const paymentsRouter = Router();
const paymentsController = new PaymentsController();

paymentsRouter.use(ensureAuthenticated);

paymentsRouter.post('/', paymentsController.create);

export { paymentsRouter };
