import { Controller } from '@nestjs/common';
import { CustomerService } from './customer.service';

//ONLY FOR ADMINS
@Controller('admin/customer')
export class CustomerAdminController {
  constructor(private readonly customerService: CustomerService) {}
}
