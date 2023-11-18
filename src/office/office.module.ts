import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from './office.entity';
import { OfficeService } from './office.service';
import { OfficeController } from './office.controller';
import { EmployeeModule } from '../employee/employee.module';
import { OfficeAdminController } from './office.admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Office]), EmployeeModule],
  controllers: [OfficeController, OfficeAdminController],
  providers: [OfficeService],
  exports: [OfficeService],
})
export class OfficeModule {}
