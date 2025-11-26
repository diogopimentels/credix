import { Request, Response } from 'express';
import { AuthService } from '../../src/services/AuthService';
import { loginSchema } from '../../src/schemas';

export class AuthController {
    constructor(private authService: AuthService) { }

    async login(request: Request, response: Response) {
        const { email, password } = loginSchema.parse(request.body);

        const { user, token } = await this.authService.execute({ email, password });

        return response.json({ user, token });
    }
}
