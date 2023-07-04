import { Controller, Post, Body } from '@nestjs/common';
import { OfficeService } from './office.service';
import { EmployeeType } from 'src/employee/employee.type';

@Controller('office')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Post('/creation')
  createOffice(
    @Body()
    body: {
      city: string;
      street: string;
      streetNumber: number;
    },
  ) {
    return this.officeService.createOffice(
      body.city,
      body.street,
      body.streetNumber,
    );
  }

  @Post('/add-employee')
  async addEmployee(
    @Body()
    body: {
      officeId: number;
      firstName: string;
      lastName: string;
      type: EmployeeType;
    },
  ) {
    return await this.officeService.addEmployee(
      body.officeId,
      body.firstName,
      body.lastName,
      body.type,
    );
  }
}
