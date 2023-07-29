import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  exports: [EmployeeService],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
