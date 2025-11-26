import { prisma } from '../../src/utils/prisma'
import bcrypt from 'bcryptjs'
import { AppError } from '../../src/utils/AppError'

interface CreateUserInput {
  name: string
  email: string
  password: string
  role?: string
}

export class UsersService {
  async create({ name, email, password, role }: CreateUserInput) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw new AppError('User with this email already exists', 400)
    }

    const hashed = await bcrypt.hash(password, 8)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role ?? 'user',
      },
    })

    // remove password before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _p, ...rest } = user
    return rest
  }
}
