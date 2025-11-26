import { Router } from 'express';
import { UsersController } from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', usersController.create);
usersRouter.post('/sessions', usersController.authenticate);

export { usersRouter };
