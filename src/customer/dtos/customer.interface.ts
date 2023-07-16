import { Packet } from '../../packet/packet.entity';

export interface CustomerInterface {
  firstName: string;
  lastName: string;
  egn: string;
  sentPacket?: Packet;
  recievedPacket?: Packet;
}
