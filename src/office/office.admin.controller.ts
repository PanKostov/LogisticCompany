import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  UseGuards,
} from '@nestjs/common';
import { OfficeService } from './office.service';
import { Employee } from '../employee/employee.entity';
import { EmployeeDto } from '../employee/dtos/employee.dto';
import { EmployeeType } from '../employee/employee.type';
import { Office } from './office.entity';
import { AdminGuard } from '../guards/admin.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('admin/office')
export class OfficeAdminController {
  constructor(private readonly officeService: OfficeService) {}

  @Post('/creation')
  @Throttle(5, 60)
  @UseGuards(AdminGuard)
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
  @Throttle(5, 60)
  @UseGuards(AdminGuard)
  async updateOffice(
    @Param('id') id: string,
    @Body()
    body: Partial<Office>,
  ): Promise<Office> {
    return await this.officeService.updateOffice(parseInt(id), body);
  }

  @Delete(':id')
  @Throttle(3, 60)
  @UseGuards(AdminGuard)
  async deleteOffice(@Param('id') id: string): Promise<Office> {
    return await this.officeService.deleteOffice(parseInt(id));
  }

  @Get('/employees/:officeId')
  @Throttle(10, 60)
  @UseGuards(AdminGuard)
  async getOfficeEmployees(
    @Param('officeId') officeId: string,
  ): Promise<Employee[]> {
    return await this.officeService.showOfficeEmployees(parseInt(officeId));
  }

  @Get(':id')
  @Throttle(10, 60)
  @UseGuards(AdminGuard)
  async getOffice(@Param('id') id: string): Promise<Office> {
    return await this.officeService.getOfficeById(parseInt(id));
  }

  @Post('/employee-for-office/:officeId')
  @Throttle(5, 60)
  @UseGuards(AdminGuard)
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

  @Patch('/employee-for-office/:officeId')
  @Throttle(5, 60)
  @UseGuards(AdminGuard)
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

  @Delete('/employee')
  @Throttle(5, 60)
  @UseGuards(AdminGuard)
  async deleteOfficeEmployee({
    officeId,
    employeeId,
  }: {
    officeId: number;
    employeeId: number;
  }): Promise<Employee> {
    return await this.officeService.deleteOfficeEmployee(officeId, employeeId);
  }

  @Delete('/employees')
  @Throttle(1, 60)
  @UseGuards(AdminGuard)
  async deleteAllEmployeesFromOffice(
    @Param('officeId') officeId: string,
  ): Promise<boolean> {
    return await this.officeService.deleteAllOfficeEmployees(
      parseInt(officeId),
    );
  }
}
