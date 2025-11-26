import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { ensureAuthenticated } from '../../../shared/infra/http/middlewares/ensureAuthenticated';

const dashboardRouter = Router();
const dashboardController = new DashboardController();

dashboardRouter.use(ensureAuthenticated);

dashboardRouter.get('/', dashboardController.index);

export { dashboardRouter };
