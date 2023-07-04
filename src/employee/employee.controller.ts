import { EmployeeService } from './employee.service';
import { Controller, Post, Body } from '@nestjs/common';
import { EmployeeType } from './employee.type';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('/creation')
  createEmployee(
    @Body() body: { firstName: string; lastName: string; type: EmployeeType },
  ) {
    this.employeeService.createEmployee(
      body.firstName,
      body.lastName,
      body.type,
    );
  }
}
