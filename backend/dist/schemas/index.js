"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPaymentSchema = exports.createLoanSchema = exports.updateClientSchema = exports.createClientSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.createClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    phone: zod_1.z.string().min(10),
    cpf: zod_1.z.string().optional(),
    address: zod_1.z.string().min(5),
    photoUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
});
exports.updateClientSchema = exports.createClientSchema.partial();
exports.createLoanSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid(),
    principal: zod_1.z.number().positive(),
    dueDate: zod_1.z.string().datetime().or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/)), // ISO or YYYY-MM-DD
});
exports.addPaymentSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
});
