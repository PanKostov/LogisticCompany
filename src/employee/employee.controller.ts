import { Controller, Post, Body, Get } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeType } from './employee.type';
import { Employee } from './employee.entity';

//TO BE USED ONLY BY ADMINS
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  createEmployee(
    @Body() body: { firstName: string; lastName: string; type: EmployeeType },
  ): Promise<Employee> {
    return this.employeeService.createEmployee(
      body.firstName,
      body.lastName,
      body.type,
    );
  }

  @Get()
  async getAllEmployees() {
    return await this.employeeService.getAllEmployees();
  }
}
