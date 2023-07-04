import { Employee } from './employee.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeType } from './employee.type';
import { Office } from '../office/office.entity';

@Injectable()
export class EmployeeService {
  constructor(@InjectRepository(Employee) private repo: Repository<Employee>) {}

  async createEmployee(
    firstName: string,
    lastName: string,
    type: EmployeeType,
    office?: Office,
  ) {
    const employee = this.repo.create({
      firstName,
      lastName,
      type,
    });
    if (!employee.offices) {
      employee.offices = new Array<Office>();
    }
    employee.offices.push(office);
    return await this.repo.save(employee);
  }
}
