import { IsString, IsNumber } from 'class-validator'

export class CreatePaymentDto {
  @IsString()
  loanId!: string

  @IsNumber()
  amount!: number
}
