import { Router } from 'express';
import { AuthController } from '../../src/controllers/AuthController';
import { AuthService } from '../../src/services/AuthService';
import { UsersRepository } from '../../src/repositories/UsersRepository';

const authRoutes = Router();

const usersRepository = new UsersRepository();
const authService = new AuthService(usersRepository);
const authController = new AuthController(authService);

authRoutes.post('/login', (req, res) => authController.login(req, res));

export { authRoutes };
