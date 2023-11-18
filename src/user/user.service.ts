import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { Equal, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Encryptor } from '../other/encryptor';
import { Packet } from '../packet/packet.entity';
import { CustomerService } from '../customer/customer.service';
import { Customer } from '../customer/customer.entity';
import { UserAccess } from './user.access.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private customerService: CustomerService,
    private encryptor: Encryptor,
  ) {
    //TODO: The password should be store in ouside cloud or in .env
    this.encryptor = new Encryptor('Password used to generate key');
  }

  async create(
    email: string,
    password: string,
    egn: string,
    isEmployee: boolean,
  ): Promise<User> {
    const egnEncrypted = await this.encryptor.encryptText(egn);
    const user = this.repo.create({
      email,
      password,
      egn: egnEncrypted,
      isEmployee,
      type: UserAccess.REGULAR,
    });

    return await this.repo.save(user);
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    if (attrs.password) {
      throw new HttpException("You can't change password here", 400);
    }

    const updatedEntity = await this.repo
      .createQueryBuilder()
      .update(User)
      .set({
        ...(attrs.email && { email: attrs.email }),
        ...(attrs.userName && { userName: attrs.userName }),
        ...(attrs.isEmployee && { isEmployee: attrs.isEmployee }),
        ...(attrs.type && { type: attrs.type }),
      })
      .where({ id })
      .returning('*')
      .execute();

    return updatedEntity.raw[0];
  }

  async updatePassword(id: number, attrs: Partial<User>): Promise<User> {
    const updatedEntity = await this.repo
      .createQueryBuilder()
      .update(User)
      .set({
        ...(attrs.password && { password: attrs.password }),
      })
      .where({ id })
      .returning('*')
      .execute();

    return updatedEntity.raw[0];
  }

  async updateType(id: number, isEmployee: boolean): Promise<User> {
    const updatedEntity = await this.repo
      .createQueryBuilder()
      .update(User)
      .set({
        ...(isEmployee && { isEmployee }),
      })
      .where({ id })
      .returning('*')
      .execute();

    return updatedEntity.raw[0];
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.repo.remove(user);
  }

  async save(user: User): Promise<User> {
    const encryptedUser = await user.encryptFields(this.encryptor);
    return await this.repo.save(encryptedUser);
  }

  async findOne(id: number): Promise<User | undefined> {
    const user = await this.repo.findOneBy({ id: Equal(id) });
    return user?.decryptFields(this.encryptor);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.repo.findOneBy({ email });
    return user?.decryptFields(this.encryptor);
  }

  async findByEgn(egn: string): Promise<User | undefined> {
    const encryptedEgn = await this.encryptor.encryptText(egn);
    const user = await this.repo.findOneBy({ egn: encryptedEgn });
    return user?.decryptFields(this.encryptor);
  }

  async getEgnOfUser(id: number): Promise<string> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user.egn;
  }

  async isEmployee(id: number): Promise<boolean> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user.isEmployee;
  }

  private async findCustomerWithSameEgn(userId: number): Promise<Customer> {
    const userEgn = await this.getEgnOfUser(userId);
    const customer = await this.customerService.findByEgn(userEgn);
    if (!customer) {
      throw new NotFoundException('customer not found');
    }
    return customer;
  }

  async sentPacketsForUser(id: number): Promise<Packet[]> {
    const customer = await this.findCustomerWithSameEgn(id);
    console.log(customer);
    return await this.customerService.getSentPackets(customer.id);
  }

  async receivedPacketsForUser(id: number): Promise<Packet[]> {
    const customer = await this.findCustomerWithSameEgn(id);

    return await this.customerService.getReceivedPackets(customer.id);
  }
}
