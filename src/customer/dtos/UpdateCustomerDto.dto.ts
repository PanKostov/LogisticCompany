import { PartialType } from '@nestjs/mapped-types'
import { CustomerDto } from './CustomerDto.dto'

export class UpdateCustomerDto extends PartialType(CustomerDto) {}
