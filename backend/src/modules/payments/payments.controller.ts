import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { PaymentsService } from './payments.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  pay(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.pay(dto.loanId, dto.amount)
  }
}
