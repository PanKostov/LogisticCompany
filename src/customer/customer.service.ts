import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CustomerDto } from './dtos/customer.dto';
import { Packet } from '../packet/packet.entity';
import { EncryptionService } from '../encryption-service/encryption.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private repo: Repository<Customer>,
    private readonly encryptionService: EncryptionService,
  ) {
    //TODO: The password should be store in ouside cloud or in .env
    this.encryptionService = new EncryptionService(
      'Password used to generate key',
    );
  }

  async createCustomer(customer: CustomerDto): Promise<Customer> {
    customer.egn = this.encryptionService.encrypt(customer.egn);
    const createdCustomer = this.repo.create(customer);

    createdCustomer.sentPackets = new Array<Packet>();
    createdCustomer.receivedPackets = new Array<Packet>();

    return this.repo.save(createdCustomer);
  }

  async updateCustomer(
    id: number,
    attrs: Partial<Customer>,
  ): Promise<Customer> {
    const updatedEntity = await this.repo
      .createQueryBuilder()
      .update(Customer)
      .set({
        ...(attrs.firstName && { firstName: attrs.firstName }),
        ...(attrs.lastName && { lastName: attrs.lastName }),
      })
      .where({ id })
      .returning('*')
      .execute();

    return updatedEntity.raw[0];
  }

  async findById(id: number): Promise<Customer> {
    const customer = await this.repo.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`Customer with id: ${id} does not exist!`);
    }
    return customer.decryptFields(this.encryptionService);
  }

  async deleteCustomer(id: number): Promise<Customer> {
    const customer = await this.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with id: ${id} does not exist!`);
    }
    return await this.repo.remove(customer);
  }

  async findByEgn(egn: string): Promise<Customer> {
    const encryptedEgn = this.encryptionService.encrypt(egn);

    const customer = await this.repo.findOneBy({ egn: encryptedEgn });
    if (!customer) {
      throw new NotFoundException(`Customer with egn: ${egn} does not exist!`);
    }

    return customer?.decryptFields(this.encryptionService);
  }

  async getEgnOfCustomer(id: number): Promise<string> {
    const customer = await this.findById(id);
    return customer.egn;
  }

  //TODO: - these 3 methods to be tested(used in the user service)
  async getSentPackets(id: number): Promise<Packet[]> {
    const customer = await this.repo.findOne({
      where: { id },
      relations: ['sentPackets'],
    });

    return customer.sentPackets;
  }

  async getReceivedPackets(id: number): Promise<Packet[]> {
    const customer = await this.repo.findOne({
      where: { id },
      relations: ['receivedPackets'],
    });

    return customer.receivedPackets;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return await this.repo.find();
  }
}
