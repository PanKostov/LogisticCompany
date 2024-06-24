import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomerController } from './customer.controller';
import { CustomerAdminController } from './customer.admin.controller';
import { CustomerService } from './customer.service';
import { Encryptor } from '../encryption-service/encryptorDepricated';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerController, CustomerAdminController],
  providers: [CustomerService, Encryptor],
  exports: [CustomerService],
})
export class CustomerModule {}
