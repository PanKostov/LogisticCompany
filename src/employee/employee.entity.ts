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

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  type: EmployeeType;

  @ManyToMany(() => Office, (office) => office.employees)
  @JoinTable({ name: 'office_employees' })
  offices: Office[];

  // async addOffice(officeId: number): Promise<Employee> {
  //   const office = await Office.findOneBy({ id: officeId });
  //   if (!office) {
  //     throw new Error('Office not found');
  //   }
  //   this.offices.push(office);
  //   return this;
  // }
}
