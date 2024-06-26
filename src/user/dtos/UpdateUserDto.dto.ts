import { PartialType } from '@nestjs/mapped-types'
import { IsOptional, IsBoolean } from 'class-validator'
import { CreateUserDto } from './CreateUserDto.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsBoolean()
  @IsOptional()
  isEmployee: boolean
}
