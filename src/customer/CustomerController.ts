import { Controller, Post, Patch, Delete, Get, Param, Body, HttpException } from '@nestjs/common'
import { CustomerService } from './CustomerService'
import { Customer } from './Customer.entity'
import { CustomerDto } from './dtos/CustomerDto.dto'
import { UpdateCustomerDto } from './dtos/UpdateCustomerDto.dto'

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(@Body() body: CustomerDto): Promise<Customer> {
    try {
      return await this.customerService.createCustomer(body)
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Patch(':id')
  async updateCustomer(@Param('id') id: string, @Body() body: UpdateCustomerDto): Promise<Customer> {
    try {
      return await this.customerService.updateCustomer(parseInt(id), body)
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string): Promise<Customer> {
    try {
      return await this.customerService.deleteCustomer(parseInt(id))
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get()
  //TODO: only for admins
  async getAllCustomers(): Promise<Customer[]> {
    return await this.customerService.getAllCustomers()
  }

  @Get(':id')
  //TODO: only for admins
  async getCustomer(@Param('id') id: string): Promise<Customer> {
    try {
      return await this.customerService.findById(parseInt(id))
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  //Post used for safety reasons
  @Post('/egn')
  //TODO: only for admins
  async findByEgn(@Body() { egn }: UpdateCustomerDto): Promise<Customer> {
    try {
      if (egn) {
        const customer = await this.customerService.findByEgn(egn)
        return customer
      }
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Get('/egn/:id')
  //TODO: only for admins
  async getEgnOfCustomer(@Param('id') id: string): Promise<string> {
    try {
      return await this.customerService.getEgnOfCustomer(parseInt(id))
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
