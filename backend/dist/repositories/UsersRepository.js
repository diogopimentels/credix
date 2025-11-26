"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const prisma_1 = require("../utils/prisma");
class UsersRepository {
    async create(data) {
        const user = await prisma_1.prisma.user.create({
            data,
        });
        return user;
    }
    async findByEmail(email) {
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        return user;
    }
    async findById(id) {
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id,
            },
        });
        return user;
    }
}
exports.UsersRepository = UsersRepository;
