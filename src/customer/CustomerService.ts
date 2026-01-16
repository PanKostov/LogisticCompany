import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Customer } from './Customer.entity'
import { CustomerDto } from './dtos/CustomerDto.dto'
import { Packet } from '../packet/Packet.entity'
import { EncryptionService } from '../encryption-service/EncryptionService'

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private repo: Repository<Customer>,
    @InjectRepository(Packet) private packetRepo: Repository<Packet>,
    private readonly encryptionService: EncryptionService,
  ) {
    this.encryptionService = new EncryptionService(process.env.ENCRYPTION_KEY)
  }

  async createCustomer(customer: CustomerDto): Promise<Customer> {
    customer.egn = await this.encryptionService.encrypt(customer.egn)
    const createdCustomer = this.repo.create(customer)

    createdCustomer.sentPackets = new Array<Packet>()
    createdCustomer.receivedPackets = new Array<Packet>()

    const savedCustomer = await this.repo.save(createdCustomer)
    return savedCustomer.decryptFields(this.encryptionService)
  }

  async updateCustomer(id: number, attrs: Partial<Customer>): Promise<Customer> {
    const updates: Partial<Customer> = {}
    if (attrs.firstName !== undefined) updates.firstName = attrs.firstName
    if (attrs.lastName !== undefined) updates.lastName = attrs.lastName
    if (attrs.egn !== undefined) updates.egn = await this.encryptionService.encrypt(attrs.egn)

    if (Object.keys(updates).length === 0) {
      return this.findById(id)
    }

    const updatedEntity = await this.repo.createQueryBuilder().update(Customer).set(updates).where({ id }).returning('*').execute()
    if (!updatedEntity.raw[0]) {
      throw new NotFoundException(`Customer with id: ${id} does not exist!`)
    }

    const updatedCustomer = await this.findById(id)
    if (!updatedCustomer) {
      throw new NotFoundException(`Customer with id: ${id} does not exist!`)
    }

    return updatedCustomer
  }

  async findById(id: number): Promise<Customer> {
    const customer = await this.repo.findOneBy({ id })
    if (!customer) {
      throw new NotFoundException(`Customer with id: ${id} does not exist!`)
    }
    return customer.decryptFields(this.encryptionService)
  }

  async deleteCustomer(id: number): Promise<Customer> {
    const customer = await this.findById(id)
    if (!customer) {
      throw new NotFoundException(`Customer with id: ${id} does not exist!`)
    }
    return await this.repo.remove(customer)
  }

  async findByEgn(egn: string): Promise<Customer> {
    const encryptedEgn = await this.encryptionService.encrypt(egn)

    const customer = await this.repo.findOneBy({ egn: encryptedEgn })
    if (!customer) {
      throw new NotFoundException(`Customer with egn: ${egn} does not exist!`)
    }

    return customer?.decryptFields(this.encryptionService)
  }

  async getEgnOfCustomer(id: number): Promise<string> {
    const customer = await this.findById(id)
    return customer.egn
  }

  //TODO: - these 3 methods to be tested(used in the user service)
  async getSentPackets(id: number): Promise<Packet[]> {
    return await this.packetRepo.find({ where: { sender: { id } } })
  }

  async getReceivedPackets(id: number): Promise<Packet[]> {
    return await this.packetRepo.find({ where: { receiver: { id }, isReceived: true } })
  }

  async getExpectedPackets(id: number): Promise<Packet[]> {
    return await this.packetRepo.find({ where: { receiver: { id }, isReceived: false } })
  }

  async getAllCustomers(): Promise<Customer[]> {
    const customers = await this.repo.find()
    return Promise.all(customers.map((customer) => customer.decryptFields(this.encryptionService)))
  }
}
