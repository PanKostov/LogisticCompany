import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CustomerInterface } from './dtos/customer.interface';
import { Packet } from '../packet/packet.entity';
import { Encryptor } from '../other/encryptor';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private repo: Repository<Customer>,
    private encryptor: Encryptor,
  ) {
    this.encryptor = new Encryptor('Password used to generate key');
  }

  async createCustomer(
    customerInterface: CustomerInterface,
  ): Promise<Customer> {
    customerInterface.egn = await this.encryptor.encryptText(
      customerInterface.egn,
    );
    const customer = this.repo.create(customerInterface);

    customer.sentPackets = new Array<Packet>();
    customer.recievedPackets = new Array<Packet>();

    return this.repo.save(customer);
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

  async findOne(id: number): Promise<Customer> {
    const customer = await this.repo.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`Customer with id: ${id} does not exist!`);
    }
    return customer.decryptFields(this.encryptor);
  }

  async deleteCustomer(id: number): Promise<Customer> {
    const customer = await this.findOne(id);
    return await this.repo.remove(customer);
  }

  async findByEgn(egn: string): Promise<Customer | undefined> {
    const encryptedEgn = await this.encryptor.encryptText(egn);
    const customer = await this.repo.findOneBy({ egn: encryptedEgn });
    return customer?.decryptFields(this.encryptor);
  }

  async getEgnOfCustomer(id: number): Promise<string> {
    const customer = await this.findOne(id);
    return customer.egn;
  }

  async getSentPackets(id: number): Promise<Packet[]> {
    return (await this.findOne(id)).sentPackets;
  }

  async getReceivedPackets(id: number): Promise<Packet[]> {
    return (await this.findOne(id)).recievedPackets;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return await this.repo.find();
  }
}
