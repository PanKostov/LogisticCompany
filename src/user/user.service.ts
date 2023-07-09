import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Encryptor } from '../other/encryptor';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private encryptor: Encryptor,
  ) {
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
    return this.repo.remove(user);
  }

  async save(user: User): Promise<User> {
    const encryptedUser = await user.encryptFields(this.encryptor);
    return await this.repo.save(encryptedUser);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    return user?.decryptFields(this.encryptor);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repo.findOneBy({ email });
    return user?.decryptFields(this.encryptor);
  }

  async findByEgn(egn: string): Promise<User> {
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
}
