import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthenticationService } from './authentication.service';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserDto } from 'src/user/dtos/user.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  //TODO isEmployee to be changed only by employees ili da napravq edin sign up za admini specialno, shte vidq
  @Post('/signup')
  @Throttle(3, 60)
  signUp(@Body() body: CreateUserDto): Promise<User> {
    return this.authService.signUp(
      body.email,
      body.password,
      body.egn,
      body.isEmployee,
    );
  }

  @Post('/login')
  @Throttle(3, 60)
  signIn(@Body() body: UserDto): Promise<User> {
    return this.authService.signIn(body.email, body.password);
  }

  @Patch('/change-password/:id')
  @Throttle(3, 60)
  updateUserPassword(
    @Param('id') id: string,
    @Body() body: { oldPassword: string; newPassword: string },
  ): Promise<User> {
    return this.authService.updatePassword(
      parseInt(id),
      body.oldPassword,
      body.newPassword,
    );
  }
}
