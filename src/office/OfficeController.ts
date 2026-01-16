import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { OfficeService } from './OfficeService'
import { Office } from './Office.entity'
import { AuthGuard } from '../guards/AuthGuard'

@Controller('office')
@UseGuards(AuthGuard)
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Get()
  async getOfficesByCity(@Query('city') city: string): Promise<Office[]> {
    return await this.officeService.showAllOfficesForCity(city)
  }
}
