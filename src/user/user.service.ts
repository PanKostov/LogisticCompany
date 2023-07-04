import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Encryptor } from '../other/encryptor';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private encryptor: Encryptor,
  ) {
    this.encryptor = new Encryptor(
      randomBytes(16),
      'Password used to generate key',
    );
  }

  async create(
    email: string,
    password: string,
    egn: string,
    isEmployee: boolean,
  ) {
    const saltOrRounds = 10;
    const passwordHashed = await bcrypt.hash(password, saltOrRounds);

    const egnEncrypted = await this.encryptor.encryptText(egn);

    const user = this.repo.create({
      email,
      password: passwordHashed,
      egn: egnEncrypted,
      isEmployee,
    });

    return this.repo.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.repo.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid password', 400);
    }

    return user;
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async findByEgn(egn: string) {
    const encryptedEgn = await this.encryptor.encryptText(egn);
    return this.repo.findOneBy({ egn: encryptedEgn });
  }

  async getEgnOfUser(id: number) {
    const user = await this.findOne(id);
    return this.encryptor.decryptText(user.egn);
  }

  async update(id: number, attrs: Partial<User>) {
    if (attrs.password) {
      throw new HttpException("You can't change password here", 400);
    }
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async updatePassword(id: number, oldPassword: string, newPassword: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new HttpException('Old password does not mach!', 400);
    }

    if (oldPassword === newPassword) {
      throw new HttpException(
        'New password must be different from the old password.',
        400,
      );
    }

    const saltOrRounds = 10;
    const passwordHashed = await bcrypt.hash(newPassword, saltOrRounds);

    user.password = passwordHashed;
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.repo.remove(user);
  }
}
