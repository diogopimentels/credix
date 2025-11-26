import { Router } from 'express';
import { DashboardController } from '../../src/controllers/DashboardController';
import { DashboardService } from '../../src/services/DashboardService';

const dashboardRoutes = Router();

const dashboardService = new DashboardService();
const dashboardController = new DashboardController(dashboardService);

dashboardRoutes.get('/', (req, res) => dashboardController.totals(req, res));

export { dashboardRoutes };
