import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { OfficeService } from './office.service';
import { EmployeeType } from 'src/employee/employee.type';
import { Office } from './office.entity';
import { Employee } from '../employee/employee.entity';

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
  ): Promise<Office> {
    return this.officeService.createOffice(
      body.city,
      body.street,
      body.streetNumber,
    );
  }

  @Patch('/update/:id')
  async updateOffice(
    @Param('id') id: string,
    @Body()
    body: Partial<Office>,
  ): Promise<Office> {
    return await this.officeService.updateOffice(parseInt(id), body);
  }

  @Delete(':id')
  async deleteOffice(@Param('id') id: string): Promise<Office> {
    return await this.officeService.deleteOffice(parseInt(id));
  }

  @Get()
  async getOfficesByCity(@Query('city') city: string): Promise<Office[]> {
    return await this.officeService.showAllOfficesForCity(city);
  }

  @Get(':id')
  async getOffice(@Param('id') id: string): Promise<Office> {
    return await this.officeService.getOfficeById(parseInt(id));
  }

  @Post('/employee')
  async addEmployee(
    @Body()
    body: {
      officeId: number;
      firstName: string;
      lastName: string;
      type: EmployeeType;
    },
  ): Promise<Employee> {
    return await this.officeService.addEmployee(
      body.officeId,
      body.firstName,
      body.lastName,
      body.type,
    );
  }

  @Patch('/employee')
  async updateEmployee(
    @Body()
    body: {
      officeId: number;
      employeeId: number;
      firstName?: string;
      lastName?: string;
      type?: EmployeeType;
    },
  ): Promise<Employee> {
    return await this.officeService.updateOfficeEmployee(
      body.officeId,
      body.employeeId,
      body.firstName,
      body.lastName,
      body.type,
    );
  }

  @Get('/employee/:id')
  async getOfficeEmployees(@Param('id') id: string): Promise<Employee[]> {
    return await this.officeService.showOfficeEmployees(parseInt(id));
  }

  @Delete('/employee/:officeId/:employeeId')
  async deleteOfficeEmployee(
    @Param('officeId') officeId: string,
    @Param('employeeId') employeeId: string,
  ): Promise<Employee> {
    return await this.officeService.deleteOfficeEmployee(
      parseInt(officeId),
      parseInt(employeeId),
    );
  }
}
