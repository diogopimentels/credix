import { Module } from '@nestjs/common'
import { LoansService } from './loans.service'
import { LoansController } from './loans.controller'
import { PrismaService } from '../../prisma/prisma.service'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [LoansController],
  providers: [LoansService, PrismaService],
  exports: [LoansService],
})
export class LoansModule {}
