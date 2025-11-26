import { Router } from 'express';
import { LoansController } from '../../src/controllers/LoansController';
import { LoansService } from '../../src/services/LoansService';

const loansRoutes = Router();

const loansService = new LoansService();
const loansController = new LoansController(loansService);

loansRoutes.post('/', (req, res) => loansController.create(req, res));
loansRoutes.get('/', (req, res) => loansController.index(req, res));

export { loansRoutes };
