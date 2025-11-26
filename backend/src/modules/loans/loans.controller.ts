import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common'
import { LoansService } from './loans.service'
import { CreateLoanDto } from './dto/create-loan.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('emprestimos')
@UseGuards(AuthGuard('jwt'))
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Post()
  create(@Body() dto: CreateLoanDto) {
    return this.loansService.create(dto)
  }

  @Get()
  findAll() {
    return this.loansService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loansService.findOne(id)
  }
}
