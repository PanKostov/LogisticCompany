//method get all packages
//kakto i filtrirane po paketi(samo za slujitelite)
//get packages for user(customer)

import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { PacketService } from './packet.service';
import { SendPackageInterface } from './dtos/send.package.interface';
import { Packet } from './packet.entity';

@Controller('packet')
export class PacketController {
  constructor(private readonly packetService: PacketService) {}
  @Post('/sending')
  async sendPackage(@Body() body: SendPackageInterface): Promise<Packet> {
    body.isRecieved = false;
    return await this.packetService.sendPackage(body);
  }

  @Patch('/recieving/:id')
  async receivePackage(@Param(':id') id: string): Promise<Packet> {
    return await this.packetService.receivePackage(parseInt(id));
  }
}
