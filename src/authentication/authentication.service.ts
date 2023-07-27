import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthenticationService {
  private readonly SALT_OR_ROUNDS_VALUE = 10;

  constructor(private userService: UserService) {}

  async signUp(email: string, password: string, egn: string): Promise<User> {
    const saltOrRounds = this.SALT_OR_ROUNDS_VALUE;
    const passwordHashed = await bcrypt.hash(password, saltOrRounds);

    let user = await this.userService.findByEmail(email);
    if (user) {
      throw new HttpException(`User with email: ${email} already exists!`, 400);
    }

    user = await this.userService.findByEgn(egn);
    if (user) {
      throw new HttpException('User with such an egn already exists!', 400);
    }

    return await this.userService.create(email, passwordHashed, egn, false);
  }

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found!`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password! ', 400);
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
      throw new NotFoundException('User not found!');
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

    const saltOrRounds = this.SALT_OR_ROUNDS_VALUE;
    const passwordHashed = await bcrypt.hash(newPassword, saltOrRounds);

    return this.userService.updatePassword(id, { password: passwordHashed });
  }
}
