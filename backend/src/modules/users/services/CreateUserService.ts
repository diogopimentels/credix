import { hash } from 'bcryptjs';
import { UsersRepository } from '../repositories/UsersRepository';
import { AppError } from '../../../shared/errors/AppError';
import { z } from 'zod';

const createUserSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['admin', 'user']).default('user'),
});

type CreateUserRequest = z.infer<typeof createUserSchema>;

export class CreateUserService {
    constructor(private usersRepository: UsersRepository) { }

    async execute({ name, email, password, role }: CreateUserRequest) {
        const userAlreadyExists = await this.usersRepository.findByEmail(email);

        if (userAlreadyExists) {
            throw new AppError('User already exists');
        }

        const passwordHash = await hash(password, 8);

        const user = await this.usersRepository.create({
            name,
            email,
            password: passwordHash,
            role,
        });

        return user;
    }
}
