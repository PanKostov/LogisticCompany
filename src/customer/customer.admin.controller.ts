import { Controller } from '@nestjs/common';
import { CustomerService } from './customer.service';

//ONLY FOR ADMINS
@Controller('customer/admin')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
}
