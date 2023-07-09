import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { EmployeeType } from './employee.type';
import { Office } from '../office/office.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ enum: EmployeeType, type: 'enum' })
  type: EmployeeType;

  @ManyToMany(() => Office, (office) => office.employees)
  @JoinTable({ name: 'office_employees' })
  offices: Office[];
}
