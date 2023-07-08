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
    const user = this.repo.create({
      email,
      password,
      egn,
      isEmployee,
    });

    return await this.repo.save(user);
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {
    if (attrs.password) {
      throw new HttpException("You can't change password here", 400);
    }

    if (attrs.egn) {
      attrs.egn = await this.encryptor.encryptText(attrs.egn);
    }
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return await this.repo.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repo.remove(user);
  }

  async save(user: User): Promise<User> {
    return await this.repo.save(user);
  }

  async findOne(id: number): Promise<User> {
    return await this.repo.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.repo.findOneBy({ email });
  }

  async findByEgn(egn: string): Promise<User> {
    const encryptedEgn = await this.encryptor.encryptText(egn);
    return await this.repo.findOneBy({ egn: encryptedEgn });
  }

  async getEgnOfUser(id: number): Promise<string> {
    const user = await this.findOne(id);
    return await this.encryptor.decryptText(user.egn);
  }
}
