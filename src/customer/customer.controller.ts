import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  Body,
  HttpException,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';
import { CustomerDto } from './dtos/customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(@Body() body: CustomerDto): Promise<Customer> {
    try {
      return await this.customerService.createCustomer(body);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() body: UpdateCustomerDto,
  ): Promise<Customer> {
    try {
      return await this.customerService.updateCustomer(parseInt(id), body);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string): Promise<Customer> {
    try {
      return await this.customerService.deleteCustomer(parseInt(id));
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  //TODO: only for admins
  async getOffice(@Param('id') id: string): Promise<Customer> {
    try {
      return await this.customerService.findById(parseInt(id));
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  //Post used for safety reasons
  @Post('/egn')
  //TODO: only for admins
  async findByEgn(@Body() body: UpdateCustomerDto): Promise<Customer> {
    const { egn } = body;
    try {
      if (egn) {
        const customer = await this.customerService.findByEgn(egn);
        return customer;
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('/egn/:id')
  //TODO: only for admins
  async getEgn(@Param('id') id: string): Promise<string> {
    try {
      return await this.customerService.getEgnOfCustomer(parseInt(id));
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
