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
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('/signup')
  @Throttle(3, 60)
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(
      body.email,
      body.password,
      body.egn,
      body.isEmployee,
    );
  }

  @Post('/login')
  @Throttle(3, 60)
  loginUser(@Body() body: CreateUserDto) {
    return this.usersService.login(body.email, body.password);
  }

  @Get('/:id')
  @Throttle(3, 60)
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  // @Get('/egn')
  // @Throttle(3, 60)
  // async findUserByEgn(segashniq lognat user) {
  //da go namerq po egn v bazata
  //   const user = await this.usersService.findByEgn(body.egn);
  //   if (!user) {
  //     throw new NotFoundException('user not found');
  //   }
  //   return user;
  // }

  @Get('/egn/:id')
  @Throttle(3, 60)
  async getEgnOfUser(@Param('id') id: string) {
    return await this.usersService.getEgnOfUser(parseInt(id));
  }

  @Delete('/:id')
  @Throttle(3, 60)
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  @Throttle(3, 60)
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Patch('/change-password/:id')
  @Throttle(3, 60)
  updateUserPassword(
    @Param('id') id: string,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.usersService.updatePassword(
      parseInt(id),
      body.oldPassword,
      body.newPassword,
    );
  }
}
