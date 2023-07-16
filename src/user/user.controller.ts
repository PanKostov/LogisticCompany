import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Throttle } from '@nestjs/throttler';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}
  //To be used only by employees untill last 2 methods
  @Get('/:id')
  @Throttle(3, 60)
  async findUser(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Post('/egn')
  @Throttle(3, 60)
  async findUserByEgn(@Body() body: { egn: string }) {
    const user = await this.usersService.findByEgn(body.egn);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get('/egn/:id')
  @Throttle(3, 60)
  async getEgnOfUser(@Param('id') id: string): Promise<string> {
    return await this.usersService.getEgnOfUser(parseInt(id));
  }

  @Delete('/:id')
  @Throttle(3, 60)
  async removeUser(@Param('id') id: string): Promise<User> {
    return await this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  @Throttle(3, 60)
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(parseInt(id), body);
  }

  //Can be used only by the logged in user
  // @Get()
  // async getSentPacketsForUser() {
  //   //get user from current session or use JWT??
  //   return await this.usersService.sentPacketsForUser()
  // }

  // @Get()
  // async getReceivedPacketsForUser() {
  //   //get user from current session or use JWT??
  //   return await this.usersService.receivedPacketsForUser()
  // }
}