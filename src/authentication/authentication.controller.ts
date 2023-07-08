import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { User } from '../user/user.entity';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

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
  signIn(@Body() body: CreateUserDto): Promise<User> {
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
