import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Packet } from './packet.entity';
import { PacketController } from './packet.controller';
import { PacketService } from './packet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Packet])],
  controllers: [PacketController],
  providers: [PacketService],
})
export class PacketModule {}
