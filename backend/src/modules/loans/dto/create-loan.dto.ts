import { IsString, IsNumber, IsDateString } from 'class-validator'

export class CreateLoanDto {
  @IsString()
  clientId!: string

  @IsNumber()
  amount!: number

  @IsDateString()
  dueDate!: string
}
