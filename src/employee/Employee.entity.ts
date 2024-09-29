import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { EmployeeType } from './models/EmployeeType'
import { Office } from '../office/Office.entity'

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  firstName: string

  @Column({ type: 'varchar' })
  lastName: string

  @Column({ enum: EmployeeType, type: 'enum' })
  type: EmployeeType

  @ManyToMany(() => Office, (office) => office.employees)
  @JoinTable({ name: 'office_employees' })
  offices: Office[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
