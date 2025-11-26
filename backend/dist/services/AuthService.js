"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const AppError_1 = require("../utils/AppError");
const env_1 = require("../config/env");
class AuthService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute({ email, password }) {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new AppError_1.AppError('Invalid email or password', 401);
        }
        const passwordMatch = await (0, bcryptjs_1.compare)(password, user.password);
        if (!passwordMatch) {
            throw new AppError_1.AppError('Invalid email or password', 401);
        }
        const token = (0, jsonwebtoken_1.sign)({}, env_1.env.JWT_SECRET, {
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
exports.AuthService = AuthService;
