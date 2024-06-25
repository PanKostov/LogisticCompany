import { InjectRepository } from '@nestjs/typeorm'
import { Office } from './Office.entity'
import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Employee } from '../employee/employee.entity'
import { EmployeeType } from '../employee/models/EmployeeType'
import { EmployeeService } from '../employee/EmployeeService'

@Injectable()
export class OfficeService {
  constructor(@InjectRepository(Office) private repo: Repository<Office>, private readonly employeeService: EmployeeService) {}

  createOffice(city: string, street: string, streetNumber: number): Promise<Office> {
    const office = this.repo.create({
      city,
      street,
      streetNumber,
    })

    return this.repo.save(office)
  }

  async updateOffice(id: number, updatedFields: Partial<Office>): Promise<Office> {
    const updatedEntity = await this.repo
      .createQueryBuilder()
      .update(Office)
      .set({
        ...(updatedFields.city && { city: updatedFields.city }),
        ...(updatedFields.street && { street: updatedFields.street }),
        ...(updatedFields.streetNumber && {
          streetNumber: updatedFields.streetNumber,
        }),
      })
      .where({ id })
      .returning('*')
      .execute()

    return updatedEntity.raw[0]
  }

  async deleteOffice(id: number): Promise<Office> {
    const office = await this.getOfficeById(id)
    await this.employeeService.deleteAllOfficeEmployees(id)
    return this.repo.remove(office)
  }

  async getOfficeById(id: number): Promise<Office> {
    const office = await this.repo.findOneBy({ id })
    if (!office) {
      throw new NotFoundException(`Office with id: ${id} does not exist`)
    }
    return office
  }

  async showAllOfficesForCity(city: string): Promise<Office[]> {
    const offices = await this.repo.find({ where: { city } })
    if (offices.length === 0) {
      throw new NotFoundException(`Offices from city: ${city} does not exist!`)
    }

    return offices
  }

  async addEmployee(officeId: number, firstName: string, lastName: string, type: EmployeeType): Promise<Employee> {
    const office = await this.getOfficeById(officeId)

    return this.employeeService.createEmployee(firstName, lastName, type, office)
  }

  async updateOfficeEmployee(officeId: number, employeeId: number, firstName?: string, lastName?: string, type?: EmployeeType): Promise<Employee> {
    await this.getOfficeById(officeId)
    return this.employeeService.updateEmployee(employeeId, {
      firstName,
      lastName,
      type,
    })
  }

  async showOfficeEmployees(id: number): Promise<Employee[]> {
    return await this.employeeService.getOfficeEmployees(id)
  }

  async getOfficeEmployeeById(officeId: number, employeeId: number): Promise<Employee | undefined> {
    const officeEmployees = await this.showOfficeEmployees(officeId)
    const employee = officeEmployees.find((employee) => employee.id == employeeId)
    return employee
  }

  async deleteOfficeEmployee(officeId: number, employeeId: number): Promise<Employee> {
    await this.getOfficeById(officeId)
    return await this.employeeService.deleteEmployee(employeeId)
  }

  async deleteAllOfficeEmployees(officeId: number): Promise<boolean> {
    return await this.employeeService.deleteAllOfficeEmployees(officeId)
  }
}
