import { PartialType } from '@nestjs/mapped-types'
import { EmployeeDto } from './EmployeeDto.dto'

export class UpdateEmployeeDto extends PartialType(EmployeeDto) {}
