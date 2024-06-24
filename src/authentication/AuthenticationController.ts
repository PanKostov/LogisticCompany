import { Controller, Post, Body, Patch, Session, UseGuards, SetMetadata } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { AuthenticationService } from './AuthenticationService'
import { User } from '../user/user.entity'
import { CreateUserDto } from '../user/dtos/create-user.dto'
import { UserDto } from '../user/dtos/user.dto'
import { AuthGuard } from '../guards/AuthGuard'
import { UserResponseDto } from 'src/user/dtos/user.response.dto'
import { FIVE_MINUTES_TTL, ONE_MINUTE_TTL } from 'src/utils/RateLimitting'
import { ChangePasswordRequestDto } from './dtos/ChangePasswordRequestDto.dto'

export const Public = () => SetMetadata('isPublic', true)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('/signup')
  async signUp(@Body() body: CreateUserDto, @Session() session: any): Promise<UserResponseDto> {
    const user = await this.authService.signUp(body.email, body.password, body.egn)
    session.user = user

    return user
  }

  @Post('/login')
  @Public()
  @Throttle({ default: { limit: 5, ttl: ONE_MINUTE_TTL } })
  async signIn(@Body() body: UserDto, @Session() session: any): Promise<UserResponseDto> {
    const user = await this.authService.signIn(body.email, body.password)
    session.user = user
    return user
  }

  @Post('/signout')
  signOut(@Session() session: any): void {
    session.user = null
  }

  @Patch('/password')
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 5, ttl: FIVE_MINUTES_TTL } })
  async updateUserPassword(@Body() body: ChangePasswordRequestDto, @Session() session: { user: User }): Promise<void> {
    console.log(session)
    await this.authService.updatePassword(session.user.id, body.oldPassword, body.newPassword)
  }

  //TODO: forgot-password - to setup new method - need an email service for that
  // @Patch('/forgotten-password/user/:id')
  // @Throttle(3, 60)
  // async newUserPassword(
  //   @Param('id') id: string,
  //   @Body() body: { oldPassword: string; newPassword: string },
  // ): Promise<User> {
  //   return await this.authService.updatePassword(
  //     parseInt(id),
  //     body.oldPassword,
  //     body.newPassword,
  //   );
  // }
}
