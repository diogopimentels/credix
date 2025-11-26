import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { UsersRepository } from '../repositories/UsersRepository';
import { AppError } from '../../../shared/errors/AppError';
import { z } from 'zod';

const authUserSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

type AuthUserRequest = z.infer<typeof authUserSchema>;

export class AuthenticateUserService {
    constructor(private usersRepository: UsersRepository) { }

    async execute({ email, password }: AuthUserRequest) {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Email or password incorrect');
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new AppError('Email or password incorrect');
        }

        const secret = process.env.JWT_SECRET || 'default';

        const token = sign({ sub: user.id }, secret, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        });

        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token,
        };
    }
}
