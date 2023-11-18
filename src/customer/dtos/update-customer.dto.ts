import { PartialType } from '@nestjs/mapped-types';
import { CustomerDto } from './customer.dto';

export class UpdateCustomerDto extends PartialType(CustomerDto) {}
