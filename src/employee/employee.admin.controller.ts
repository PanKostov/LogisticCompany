import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.entity';
import { EmployeeDto } from './dtos/employee.dto';
import { AdminGuard } from '../guards/AdminGuard';

@Controller('admin/employee')
export class EmployeeAdminController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseGuards(AdminGuard)
  createEmployee(@Body() body: EmployeeDto): Promise<Employee> {
    return this.employeeService.createEmployee(
      body.firstName,
      body.lastName,
      body.type,
    );
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllEmployees() {
    return await this.employeeService.getAllEmployees();
  }
}
