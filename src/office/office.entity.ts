import { Employee } from '../employee/employee.entity';
import { Packet } from '../packet/packet.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Office {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  street: string;

  @Column({ type: 'int4' })
  streetNumber: number;

  @ManyToMany(() => Employee)
  @JoinTable({ name: 'office_employees' })
  employees: Employee[];

  @OneToMany(() => Packet, (packet) => packet.fromOffice)
  sentPackets: Packet[];

  @OneToMany(() => Packet, (packet) => packet.toOffice)
  recievedPackets: Packet[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  async addEmployee(employee: Employee): Promise<Employee> {
    if (!this.employees) {
      this.employees = new Array<Employee>();
    }
    this.employees.push(employee);
    return employee;
  }
}
