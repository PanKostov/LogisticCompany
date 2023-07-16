import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';
import { CustomerInterface } from './dtos/customer.interface';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(@Body() body: CustomerInterface): Promise<Customer> {
    return await this.customerService.createCustomer(body);
  }

  @Patch()
  async updateCustomer(
    @Param('id') id: string,
    @Body() body: Partial<Customer>,
  ): Promise<Customer> {
    return await this.updateCustomer(id, body);
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string): Promise<Customer> {
    return await this.customerService.deleteCustomer(parseInt(id));
  }

  @Get(':id')
  async getOffice(@Param('id') id: string): Promise<Customer> {
    return await this.customerService.findOne(parseInt(id));
  }

  @Post('/egn')
  async findUserByEgn(@Body() body: { egn: string }) {
    const user = await this.customerService.findByEgn(body.egn);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get('/egn/:id')
  async getEgnOfUser(@Param('id') id: string): Promise<string> {
    return await this.customerService.getEgnOfCustomer(parseInt(id));
  }
}
