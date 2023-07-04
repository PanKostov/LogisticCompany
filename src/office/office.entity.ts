import { Employee } from '../employee/employee.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Office {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  streetNumber: number;

  @ManyToMany(() => Employee)
  @JoinTable({ name: 'office_employees' })
  employees: Employee[];

  async addEmployee(employee: Employee): Promise<Employee> {
    if (!this.employees) {
      this.employees = new Array<Employee>();
    }
    this.employees.push(employee);
    return employee;
  }
}
