import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AdminGuard } from '../guards/AdminGuard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserAccess } from './user.access.enum';

@Controller('admin/user')
export class UserAdminController {
  constructor(private readonly usersService: UserService) {}

  @Get('/:id')
  @UseGuards(AdminGuard)
  async findUser(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Post('/egn')
  @UseGuards(AdminGuard)
  async findUserByEgn(@Body() body: { egn: string }) {
    const user = await this.usersService.findByEgn(body.egn);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get('/egn/:id')
  @UseGuards(AdminGuard)
  async getEgnOfUser(@Param('id') id: string): Promise<string> {
    return await this.usersService.getEgnOfUser(parseInt(id));
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async removeUser(@Param('id') id: string): Promise<User> {
    return await this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateUser(parseInt(id), body);
  }

  @Patch('user-access/:id')
  @UseGuards(AdminGuard)
  async updateUserAccess(
    @Param('id') id: string,
    { userAccessType }: { userAccessType: UserAccess },
  ) {
    return await this.usersService.updateUser(parseInt(id), {
      type: userAccessType,
    });
  }
}
