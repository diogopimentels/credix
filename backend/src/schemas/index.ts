import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const createClientSchema = z.object({
    name: z.string().min(3),
    phone: z.string().min(10),
    cpf: z.string().optional(),
    address: z.string().min(5),
    photoUrl: z.string().url().optional().or(z.literal('')),
});

export const updateClientSchema = createClientSchema.partial();

export const createLoanSchema = z.object({
    clientId: z.string().uuid(),
    principal: z.number().positive(),
    dueDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)), // ISO or YYYY-MM-DD
});

export const addPaymentSchema = z.object({
    amount: z.number().positive(),
});
