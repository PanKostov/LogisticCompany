import { Controller, Get, Query } from '@nestjs/common'
import { OfficeService } from './OfficeService'
import { Office } from './Office.entity'

@Controller('office')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Get()
  async getOfficesByCity(@Query('city') city: string): Promise<Office[]> {
    return await this.officeService.showAllOfficesForCity(city)
  }
}
