import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Packet } from './packet.entity';

@Injectable()
export class PacketService {
  constructor(@InjectRepository(Packet) private repo: Repository<Packet>) {}
}
