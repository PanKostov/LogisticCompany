import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { OfficeService } from './office.service';
import { EmployeeType } from 'src/employee/employee.type';
import { Office } from './office.entity';

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

  @Patch('/update/:id')
  async updateOffice(
    @Param('id') id: string,
    @Body()
    body: Partial<Office>,
  ) {
    return await this.officeService.updateOffice(parseInt(id), body);
  }
  //
}
