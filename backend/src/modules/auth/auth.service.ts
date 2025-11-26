import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (existing) throw new BadRequestException('Email already in use')

    const hashed = await bcrypt.hash(dto.password, 8)
    const user = await this.prisma.user.create({
      data: { name: dto.name, email: dto.email, password: hashed },
    })
    const { password, ...rest } = user as any
    return rest
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) return null
    const match = await bcrypt.compare(password, user.password)
    if (!match) return null
    const { password: _p, ...rest } = user as any
    return rest
  }

  async login(user: { id: string; email: string; name: string }) {
    const payload = { sub: user.id, email: user.email }
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })

    // store refresh token
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    await this.prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    })

    return { accessToken, refreshToken, user }
  }

  async refresh(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token } })
    if (!stored) throw new UnauthorizedException('Invalid refresh token')
    if (stored.expiresAt < new Date()) throw new UnauthorizedException('Refresh token expired')

    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } })
    if (!user) throw new UnauthorizedException('User not found')

    const payload = { sub: user.id, email: user.email }
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })
    return { accessToken }
  }
}
