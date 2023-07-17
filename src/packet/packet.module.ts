import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Packet } from './packet.entity';
import { PacketController } from './packet.controller';
import { PacketService } from './packet.service';
import { CustomerModule } from '../customer/customer.module';
import { OfficeModule } from '../office/office.module';

@Module({
  imports: [TypeOrmModule.forFeature([Packet]), CustomerModule, OfficeModule],
  controllers: [PacketController],
  providers: [PacketService],
})
export class PacketModule {}
