import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmployeeAdminController } from './EmployeeAdminController'
import { EmployeeService } from './EmployeeService'
import { Employee } from './employee.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  exports: [EmployeeService],
  controllers: [EmployeeAdminController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
