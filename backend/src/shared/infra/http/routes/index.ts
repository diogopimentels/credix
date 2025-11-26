import { Router } from 'express';
import { usersRouter } from '../../../../modules/users/routes/users.routes';
import { clientsRouter } from '../../../../modules/clients/routes/clients.routes';
import { loansRouter } from '../../../../modules/loans/routes/loans.routes';
import { paymentsRouter } from '../../../../modules/payments/routes/payments.routes';
import { dashboardRouter } from '../../../../modules/dashboard/routes/dashboard.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/clients', clientsRouter);
routes.use('/loans', loansRouter);
routes.use('/payments', paymentsRouter);
routes.use('/dashboard', dashboardRouter);

export { routes };
