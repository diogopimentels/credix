"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const schemas_1 = require("../schemas");
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(request, response) {
        const { email, password } = schemas_1.loginSchema.parse(request.body);
        const { user, token } = await this.authService.execute({ email, password });
        return response.json({ user, token });
    }
}
exports.AuthController = AuthController;
