import { Controller, Post, Body, Get, UseGuards, Param, Patch, Delete } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { EmployeeService } from './EmployeeService'
import { Employee } from './Employee.entity'
import { EmployeeDto } from './dtos/EmployeeDto.dto'
import { AdminGuard } from '../guards/AdminGuard'
import { UpdateEmployeeDto } from './dtos/UpdateEmployeeDto.dto'

@Controller('admin/employee')
export class EmployeeAdminController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseGuards(AdminGuard)
  createEmployee(@Body() body: EmployeeDto): Promise<Employee> {
    return this.employeeService.createEmployee(body.firstName, body.lastName, body.type)
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllEmployees() {
    return await this.employeeService.getAllEmployees()
  }

  @Get('/:id')
  @UseGuards(AdminGuard)
  async getEmployee(@Param('id') id: string): Promise<Employee> {
    return await this.employeeService.getEmployeeById(parseInt(id))
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async updateEmployee(@Param('id') id: string, @Body() body: UpdateEmployeeDto): Promise<Employee> {
    return await this.employeeService.updateEmployee(parseInt(id), body)
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async deleteEmployee(@Param('id') id: string): Promise<Employee> {
    return await this.employeeService.deleteEmployee(parseInt(id))
  }
}
