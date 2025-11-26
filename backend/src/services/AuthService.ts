import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { UsersRepository } from '../repositories/UsersRepository';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { loginSchema } from '../schemas';
import { z } from 'zod';

type LoginRequest = z.infer<typeof loginSchema>;

export class AuthService {
    constructor(private usersRepository: UsersRepository) { }

    async execute({ email, password }: LoginRequest) {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = sign({}, env.JWT_SECRET, {
            subject: user.id,
            expiresIn: '1d',
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    }
}
