import { Router } from 'express';
import { authRoutes } from '../src/routes/auth.routes';
import { clientsRoutes } from '../src/routes/clients.routes';
import { loansRoutes } from '../src/routes/loans.routes';
import { dashboardRoutes } from '../src/routes/dashboard.routes';
import { UsersController } from '../src/controllers/UsersController';

const routes = Router();

routes.use('/login', authRoutes);
routes.use('/clientes', clientsRoutes);
routes.use('/emprestimos', loansRoutes);
routes.use('/dashboard', dashboardRoutes);
routes.use('/fechamento-mensal', dashboardRoutes);

// users route (registration)
const usersRouter = Router();
const usersController = new UsersController();
usersRouter.post('/', (req, res) => usersController.create(req, res));
routes.use('/users', usersRouter);

// Alias for consistency with frontend if needed
routes.use('/clients', clientsRoutes);
routes.use('/loans', loansRoutes);

export { routes };
