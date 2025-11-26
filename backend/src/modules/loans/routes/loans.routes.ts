import { Router } from 'express';
import { LoansController } from '../controllers/LoansController';
import { ensureAuthenticated } from '../../../shared/infra/http/middlewares/ensureAuthenticated';

const loansRouter = Router();
const loansController = new LoansController();

loansRouter.use(ensureAuthenticated);

loansRouter.post('/', loansController.create);
loansRouter.get('/', loansController.index);
loansRouter.get('/:id', loansController.show);
loansRouter.patch('/:id/status', loansController.updateStatus);

export { loansRouter };
