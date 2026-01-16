import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 120 })
  name: string

  @Column({ type: 'varchar', length: 40, nullable: true })
  legalId?: string

  @Column({ type: 'varchar', nullable: true })
  address?: string

  @Column({ type: 'varchar', nullable: true })
  contact?: string

  @Column({ type: 'text', nullable: true })
  notes?: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
