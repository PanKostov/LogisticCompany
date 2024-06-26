import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { EncryptionService } from '../encryption-service/EncryptionService'
import { Packet } from '../packet/PacketEntity'

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: '80' })
  firstName: string

  @Column({ type: 'varchar', length: '80' })
  lastName: string

  @Column({ unique: true, type: 'varchar' })
  egn: string

  @OneToMany(() => Packet, (packet) => packet.sender)
  sentPackets: Packet[]

  @OneToMany(() => Packet, (packet) => packet.receiver)
  receivedPackets: Packet[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  async encryptFields(encryptionService: EncryptionService): Promise<Customer> {
    this.egn = await encryptionService.encrypt(this.egn)
    return this
  }

  async decryptFields(encryptionService: EncryptionService): Promise<Customer> {
    this.egn = await encryptionService.encrypt(this.egn)
    return this
  }
}
