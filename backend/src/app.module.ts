import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { ClientsModule } from './modules/clients/clients.module'
import { LoansModule } from './modules/loans/loans.module'
import { PaymentsModule } from './modules/payments/payments.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ClientsModule,
    LoansModule,
    PaymentsModule,
    DashboardModule,
  ],
})
export class AppModule {}
