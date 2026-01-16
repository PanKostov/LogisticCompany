import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { CompanyService } from './CompanyService'
import { Company } from './Company.entity'
import { CompanyDto } from './dtos/CompanyDto.dto'
import { UpdateCompanyDto } from './dtos/UpdateCompanyDto.dto'
import { AdminGuard } from '../guards/AdminGuard'

@Controller('company')
@UseGuards(AdminGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getCompany(): Promise<Company | null> {
    return this.companyService.getCompany()
  }

  @Post()
  async createCompany(@Body() body: CompanyDto): Promise<Company> {
    return this.companyService.createCompany(body)
  }

  @Patch(':id')
  async updateCompany(@Param('id') id: string, @Body() body: UpdateCompanyDto): Promise<Company> {
    return this.companyService.updateCompany(parseInt(id), body)
  }

  @Delete(':id')
  async deleteCompany(@Param('id') id: string): Promise<Company> {
    return this.companyService.deleteCompany(parseInt(id))
  }
}
