import { InjectRepository } from '@nestjs/typeorm';
import { Office } from './office.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Employee } from '../employee/employee.entity';
import { EmployeeType } from '../employee/employee.type';
import { EmployeeService } from '../employee/employee.service';

@Injectable()
export class OfficeService {
  constructor(
    @InjectRepository(Office) private repo: Repository<Office>,
    private readonly employeeService: EmployeeService,
  ) {}

  createOffice(
    city: string,
    street: string,
    streetNumber: number,
    employees?: Employee[],
  ) {
    const office = this.repo.create({
      city,
      street,
      streetNumber,
      employees,
    });

    return this.repo.save(office);
  }

  async addEmployee(
    officeId: number,
    firstName: string,
    lastName: string,
    type: EmployeeType,
  ) {
    const office = await this.repo.findOneBy({ id: officeId });
    if (!office) {
      throw new NotFoundException('This office does not exist!');
    }
    return this.employeeService.createEmployee(
      firstName,
      lastName,
      type,
      office,
    );
  }
}
