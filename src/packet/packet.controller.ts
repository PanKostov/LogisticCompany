//method get all packages
//kakto i filtrirane po paketi(samo za slujitelite)
//get packages for user(customer)

import { Controller } from '@nestjs/common';
import { PacketService } from './packet.service';

@Controller('packet')
export class PacketController {
  constructor(private readonly packetService: PacketService) {}
}
