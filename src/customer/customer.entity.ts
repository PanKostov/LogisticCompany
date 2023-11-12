import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Encryptor } from '../other/encryptor';
import { Packet } from '../packet/packet.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '80' })
  firstName: string;

  @Column({ type: 'varchar', length: '80' })
  lastName: string;

  @Column({ unique: true, type: 'varchar' })
  egn: string;

  @OneToMany(() => Packet, (packet) => packet.sender)
  sentPackets: Packet[];

  @OneToMany(() => Packet, (packet) => packet.receiver)
  receivedPackets: Packet[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  async encryptFields(encryptor: Encryptor): Promise<Customer> {
    this.egn = await encryptor.encryptText(this.egn);
    return this;
  }

  async decryptFields(decryptor: Encryptor): Promise<Customer> {
    this.egn = await decryptor.decryptText(this.egn);
    return this;
  }
}
