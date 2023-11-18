import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { OfficeService } from './office.service';

@Controller('admin/office')
export class AdminOfficeController {
  constructor(private readonly officeService: OfficeService) {}
}
