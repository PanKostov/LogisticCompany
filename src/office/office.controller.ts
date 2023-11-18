import { Controller, Get, Query } from '@nestjs/common';
import { OfficeService } from './office.service';
import { Office } from './office.entity';

@Controller('office')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Get()
  async getOfficesByCity(@Query('city') city: string): Promise<Office[]> {
    return await this.officeService.showAllOfficesForCity(city);
  }
}
