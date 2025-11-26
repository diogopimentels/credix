import { Body, Controller, Post, UseGuards, Req, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto)
    return { user }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password)
    if (!user) throw new UnauthorizedException('Invalid credentials')
    return this.authService.login(user)
  }

  @Post('refresh')
  async refresh(@Body('token') token: string) {
    return this.authService.refresh(token)
  }
}
