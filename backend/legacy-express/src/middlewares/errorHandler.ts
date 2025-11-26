import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../src/utils/AppError';
import { ZodError } from 'zod';

export function errorHandler(
    err: Error,
    request: Request,
    response: Response,
    next: NextFunction
) {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    if (err instanceof ZodError) {
        return response.status(400).json({
            status: 'error',
            message: 'Validation error',
            issues: err.format(),
        });
    }

    console.error(err);

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
}
