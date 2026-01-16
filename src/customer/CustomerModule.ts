import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Customer } from './Customer.entity'
import { Packet } from '../packet/Packet.entity'
import { CustomerController } from './CustomerController'
import { CustomerAdminController } from './CustomerAdminController'
import { CustomerService } from './CustomerService'
import { EncryptionService } from '../encryption-service/EncryptionService'

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Packet])],
  controllers: [CustomerController, CustomerAdminController],
  providers: [CustomerService, EncryptionService],
  exports: [CustomerService],
})
export class CustomerModule {}
