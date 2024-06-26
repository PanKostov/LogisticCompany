import { IsAlpha, IsEnum, IsString, Length } from 'class-validator'
import { EmployeeType } from '../models/EmployeeType'

export class EmployeeDto {
  @IsString()
  @IsAlpha()
  @Length(1, 60)
  firstName: string

  @IsString()
  @IsAlpha()
  @Length(1, 60)
  lastName: string

  @IsEnum(EmployeeType)
  type: EmployeeType
}
