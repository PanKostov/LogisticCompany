import { Employee } from './Employee.entity'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { EmployeeType } from './models/EmployeeType'
import { Office } from '../office/Office.entity'

@Injectable()
export class EmployeeService {
  constructor(@InjectRepository(Employee) private repo: Repository<Employee>) {}

  async createEmployee(firstName: string, lastName: string, type: EmployeeType, office?: Office) {
    const employee = this.repo.create({
      firstName,
      lastName,
      type,
    })

    if (!employee.offices) {
      employee.offices = new Array<Office>()
    }
    employee.offices.push(office)

    return await this.repo.save(employee)
  }

  async updateEmployee(id: number, attrs: Partial<Employee>): Promise<Employee> {
    const updates: Partial<Employee> = {}
    if (attrs.firstName !== undefined) updates.firstName = attrs.firstName
    if (attrs.lastName !== undefined) updates.lastName = attrs.lastName
    if (attrs.type !== undefined) updates.type = attrs.type

    if (Object.keys(updates).length === 0) {
      return this.getEmployeeById(id)
    }

    const updatedEntity = await this.repo.createQueryBuilder().update(Employee).set(updates).where({ id }).returning('*').execute()

    if (!updatedEntity.raw[0]) {
      throw new NotFoundException(`Employee with id: ${id} does not exist`)
    }

    return updatedEntity.raw[0]
  }

  async getEmployeeById(id: number): Promise<Employee> {
    const employee = await this.repo.findOneBy({ id })
    if (!employee) {
      throw new NotFoundException(`Employee with id: ${id} does not exist`)
    }
    return employee
  }

  async getOfficeEmployees(officeId: number): Promise<Employee[]> {
    return await this.repo
      .createQueryBuilder('employee')
      .innerJoin('employee.offices', 'office')
      .where('office.id = :officeId', { officeId })
      .getMany()
  }

  async deleteEmployee(id: number): Promise<Employee> {
    const employee = await this.getEmployeeById(id)
    return await this.repo.remove(employee)
  }

  async deleteAllOfficeEmployees(officeId: number): Promise<boolean> {
    const employees = await this.getOfficeEmployees(officeId)

    employees.forEach((employee) => {
      this.repo.remove(employee)
    })

    const isDeleted = employees ? true : false

    return isDeleted
  }

  async getAllEmployees(): Promise<Employee[]> {
    return await this.repo.find()
  }
}
