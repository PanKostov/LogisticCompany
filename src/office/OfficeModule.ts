import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Office } from './Office.entity'
import { OfficeService } from './OfficeService'
import { OfficeController } from './OfficeController'
import { EmployeeModule } from '../employee/EmployeeModule'
import { OfficeAdminController } from './OfficeAdminController'

@Module({
  imports: [TypeOrmModule.forFeature([Office]), EmployeeModule],
  controllers: [OfficeController, OfficeAdminController],
  providers: [OfficeService],
  exports: [OfficeService],
})
export class OfficeModule {}
