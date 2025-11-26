import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { env } from '../../src/config/env';
import { AppError } from '../../src/utils/AppError';

interface TokenPayload {
    sub: string;
    iat: number;
    exp: number;
}

export function authMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('Token missing', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, env.JWT_SECRET);
        const { sub } = decoded as TokenPayload;

        request.user = {
            id: sub,
        };

        next();
    } catch {
        throw new AppError('Invalid token', 401);
    }
}
