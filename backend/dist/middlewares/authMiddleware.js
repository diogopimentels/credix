"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = require("jsonwebtoken");
const env_1 = require("../config/env");
const AppError_1 = require("../utils/AppError");
function authMiddleware(request, response, next) {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.AppError('Token missing', 401);
    }
    const [, token] = authHeader.split(' ');
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, env_1.env.JWT_SECRET);
        const { sub } = decoded;
        request.user = {
            id: sub,
        };
        next();
    }
    catch {
        throw new AppError_1.AppError('Invalid token', 401);
    }
}
