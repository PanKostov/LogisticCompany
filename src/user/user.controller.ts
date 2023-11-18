import {
  Controller,
  Body,
  Get,
  Patch,
  Delete,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Delete('/:id')
  @Throttle(1, 60)
  @UseGuards(AuthGuard)
  async removeUser(@Session() session: any): Promise<User> {
    return await this.usersService.remove(session.user.id);
  }

  @Patch('/:id')
  @Throttle(3, 60)
  @UseGuards(AuthGuard)
  async changeName(
    @Session() session: any,
    @Body() { userName }: { userName: string },
  ): Promise<User> {
    return await this.usersService.update(session.user.id, {
      userName,
    });
  }

  @Get('/sent/packets')
  @Throttle(5, 60)
  @UseGuards(AuthGuard)
  async getSentPacketsForUser(@Session() session: any) {
    console.log(session);
    console.log('STARTTAWEDFASDAS!!!');
    return await this.usersService.sentPacketsForUser(session.user.id);
  }

  @Get('/received-packets')
  @Throttle(5, 60)
  @UseGuards(AuthGuard)
  async getReceivedPacketsForUser(@Session() session: any) {
    return await this.usersService.receivedPacketsForUser(session.user.id);
  }
}
