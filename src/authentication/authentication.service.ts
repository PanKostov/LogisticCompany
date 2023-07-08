import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { Encryptor } from '../other/encryptor';
import { User } from '../user/user.entity';

@Injectable()
export class AuthenticationService {
  constructor(private userService: UserService, private encryptor: Encryptor) {
    this.encryptor = new Encryptor('Password used to generate key');
  }

  async signUp(
    email: string,
    password: string,
    egn: string,
    isEmployee: boolean,
  ): Promise<User> {
    const saltOrRounds = 10;
    const passwordHashed = await bcrypt.hash(password, saltOrRounds);

    const egnEncrypted = await this.encryptor.encryptText(egn);

    let user = await this.userService.findByEmail(email);

    if (user) {
      throw new HttpException('User already exists', 400);
    }
    user = await this.userService.findByEgn(egn);
    console.log(user);
    if (user) {
      throw new HttpException('User with such an egn already exists', 400);
    }

    user = await this.userService.create(
      email,
      passwordHashed,
      egnEncrypted,
      isEmployee,
    );

    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid password', 400);
    }

    return user;
  }

  async updatePassword(
    id: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.userService.findOne(id);
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
    return this.userService.save(user);
  }
}
