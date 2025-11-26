import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  totals() {
    return this.dashboardService.totals()
  }

  @Get('fechamento-mensal')
  fechamento(@Query('year') year: string, @Query('month') month: string) {
    const y = Number(year)
    const m = Number(month)
    return this.dashboardService.fechamentoMensal(y, m)
  }
}
