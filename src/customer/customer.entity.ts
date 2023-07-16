import { Packet } from 'src/packet/packet.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Encryptor } from '../other/encryptor';
@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ unique: true, type: 'varchar' })
  egn: string;

  @OneToMany(() => Packet, (packet) => packet.sender)
  sentPackets: Packet[];

  @OneToMany(() => Packet, (packet) => packet.receiver)
  recievedPackets: Packet[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  async encryptFields(encryptor: Encryptor): Promise<Customer> {
    this.egn = await encryptor.encryptText(this.egn);
    return this;
  }

  async decryptFields(dectyptor: Encryptor): Promise<Customer> {
    this.egn = await dectyptor.decryptText(this.egn);
    return this;
  }
}
