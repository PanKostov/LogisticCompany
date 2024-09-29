import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Packet } from './Packet.entity'
import { PacketController } from './PacketController'
import { PacketService } from './PacketService'
import { CustomerModule } from '../customer/CustomerModule'
import { OfficeModule } from '../office/OfficeModule'

@Module({
  imports: [TypeOrmModule.forFeature([Packet]), CustomerModule, OfficeModule],
  controllers: [PacketController],
  providers: [PacketService],
})
export class PacketModule {}
