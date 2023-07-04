import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from './office.entity';
import { OfficeService } from './office.service';
import { OfficeController } from './office.controller';
import { EmployeeService } from '../employee/employee.service';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
  imports: [TypeOrmModule.forFeature([Office]), EmployeeModule],
  controllers: [OfficeController],
  providers: [OfficeService],
})
export class OfficeModule {}
