import { Customer } from 'src/customer/customer.entity';
import { Office } from 'src/office/office.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Packet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric', precision: 6, scale: 2 })
  weight: number;

  @Column({ type: 'varchar', nullable: true })
  fromAddress: string;

  @ManyToOne(() => Office, (office) => office.sentPackets)
  fromOffice: Office;

  @ManyToOne(() => Customer, (customer) => customer.sentPackets)
  sender: Customer;

  @Column({ type: 'varchar', nullable: true })
  toAddress: string;

  @ManyToOne(() => Office, (office) => office.recievedPackets)
  toOffice: Office;

  @ManyToOne(() => Customer, (customer) => customer.recievedPackets)
  reciever: Customer;

  @Column({ type: 'numeric' })
  employeeId: number;

  @Column({ type: 'bool', default: false })
  isReceived: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
