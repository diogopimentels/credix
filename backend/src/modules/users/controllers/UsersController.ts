import { Request, Response } from 'express';
import { CreateUserService } from '../services/CreateUserService';
import { AuthenticateUserService } from '../services/AuthenticateUserService';
import { UsersRepository } from '../repositories/UsersRepository';

export class UsersController {
    async create(request: Request, response: Response) {
        const { name, email, password, role } = request.body;

        const usersRepository = new UsersRepository();
        const createUserService = new CreateUserService(usersRepository);

        const user = await createUserService.execute({
            name,
            email,
            password,
            role,
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return response.status(201).json(userWithoutPassword);
    }

    async authenticate(request: Request, response: Response) {
        const { email, password } = request.body;

        const usersRepository = new UsersRepository();
        const authenticateUserService = new AuthenticateUserService(usersRepository);

        const { user, token } = await authenticateUserService.execute({
            email,
            password,
        });

        return response.json({ user, token });
    }
}
