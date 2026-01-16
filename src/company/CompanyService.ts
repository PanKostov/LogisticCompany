import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Company } from './Company.entity'
import { CompanyDto } from './dtos/CompanyDto.dto'
import { UpdateCompanyDto } from './dtos/UpdateCompanyDto.dto'

@Injectable()
export class CompanyService {
  constructor(@InjectRepository(Company) private repo: Repository<Company>) {}

  async createCompany(payload: CompanyDto): Promise<Company> {
    const company = this.repo.create(payload)
    return this.repo.save(company)
  }

  async getCompany(): Promise<Company | null> {
    // Single-company setup: return the first record if it exists.
    const companies = await this.repo.find({ order: { id: 'ASC' }, take: 1 })
    return companies[0] ?? null
  }

  async updateCompany(id: number, attrs: UpdateCompanyDto): Promise<Company> {
    const updates: Partial<Company> = {}
    if (attrs.name !== undefined) updates.name = attrs.name
    if (attrs.legalId !== undefined) updates.legalId = attrs.legalId
    if (attrs.address !== undefined) updates.address = attrs.address
    if (attrs.contact !== undefined) updates.contact = attrs.contact
    if (attrs.notes !== undefined) updates.notes = attrs.notes

    if (Object.keys(updates).length === 0) {
      return this.getCompanyById(id)
    }

    const updatedEntity = await this.repo.createQueryBuilder().update(Company).set(updates).where({ id }).returning('*').execute()

    if (!updatedEntity.raw[0]) {
      throw new NotFoundException('company not found')
    }

    return updatedEntity.raw[0]
  }

  async deleteCompany(id: number): Promise<Company> {
    const company = await this.getCompanyById(id)
    return this.repo.remove(company)
  }

  async getCompanyById(id: number): Promise<Company> {
    const company = await this.repo.findOneBy({ id })
    if (!company) {
      throw new NotFoundException('company not found')
    }
    return company
  }
}
