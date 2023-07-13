import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Packet {
  @PrimaryGeneratedColumn()
  id: number;
}
