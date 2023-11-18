import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomerController } from './customer.controller';
import { AdminCustomerController } from './customer.admin.controller';
import { CustomerService } from './customer.service';
import { Encryptor } from '../other/encryptor';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerController, AdminCustomerController],
  providers: [CustomerService, Encryptor],
  exports: [CustomerService],
})
export class CustomerModule {}
