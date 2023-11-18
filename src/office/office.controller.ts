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
import { EmployeeType } from '../employee/employee.type';
import { Office } from './office.entity';
import { Employee } from '../employee/employee.entity';
import { EmployeeDto } from '../employee/dtos/employee.dto';

@Controller('office')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  //For admins only
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

  //For admins only
  @Patch('/update/:id')
  async updateOffice(
    @Param('id') id: string,
    @Body()
    body: Partial<Office>,
  ): Promise<Office> {
    return await this.officeService.updateOffice(parseInt(id), body);
  }

  //For admins only
  @Delete(':id')
  async deleteOffice(@Param('id') id: string): Promise<Office> {
    return await this.officeService.deleteOffice(parseInt(id));
  }

  @Get(':id')
  async getOffice(@Param('id') id: string): Promise<Office> {
    return await this.officeService.getOfficeById(parseInt(id));
  }

  @Get()
  async getOfficesByCity(@Query('city') city: string): Promise<Office[]> {
    return await this.officeService.showAllOfficesForCity(city);
  }

  //For admins only
  @Post('/employee-for-office/:officeId')
  async addEmployee(
    @Param('officeId') officeId: string,
    @Body()
    body: EmployeeDto,
  ): Promise<Employee> {
    return await this.officeService.addEmployee(
      parseInt(officeId),
      body.firstName,
      body.lastName,
      body.type,
    );
  }

  //For admins only
  @Patch('/employee-for-office/:officeId')
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

  @Get('/employees/:officeId')
  async getOfficeEmployees(
    @Param('officeId') officeId: string,
  ): Promise<Employee[]> {
    return await this.officeService.showOfficeEmployees(parseInt(officeId));
  }

  //For admins only
  @Delete('/employee')
  async deleteOfficeEmployee({
    officeId,
    employeeId,
  }: {
    officeId: number;
    employeeId: number;
  }): Promise<Employee> {
    return await this.officeService.deleteOfficeEmployee(officeId, employeeId);
  }

  //For admins only
  @Delete('/employees')
  async deleteAllEmployeesFromOffice(
    @Param('officeId') officeId: string,
  ): Promise<boolean> {
    return await this.officeService.deleteAllOfficeEmployees(
      parseInt(officeId),
    );
  }
}
