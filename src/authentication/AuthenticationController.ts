import { Controller, Post, Body, Patch, Session, UseGuards, SetMetadata, Get } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { AuthenticationService } from './AuthenticationService'
import { User } from '../user/User.entity'
import { AuthGuard } from '../guards/AuthGuard'
import { UserResponseDto } from '../user/dtos/UserResponseDto.dto'
import { FIVE_MINUTES_TTL, ONE_MINUTE_TTL } from '../utils/RateLimitting'
import { ChangePasswordRequestDto } from './dtos/ChangePasswordRequestDto.dto'
import { CreateUserDto } from '../user/dtos/CreateUserDto.dto'
import { UserDto } from '../user/dtos/UserDto.dto'

export const Public = () => SetMetadata('isPublic', true)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('/signup')
  async signUp(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.authService.signUp(body.email, body.password, body.egn)

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

  @Get()
  getSession(@Session() session: any) {
    return session
  }

  @Post('/sign-out')
  signOut(@Session() session: any): void {
    session.user = null
  }

  //TODO - make AuthGuard default guard, and make the endpoint public if necessary
  @Patch('/password')
  @UseGuards(AuthGuard)
  @Throttle({ default: { limit: 5, ttl: FIVE_MINUTES_TTL } })
  async updateUserPassword(@Body() body: ChangePasswordRequestDto, @Session() session: { user: User }): Promise<void> {
    console.log(session)
    await this.authService.updatePassword(session.user.id, body.oldPassword, body.newPassword)
  }

  @Post('/forgotten-password/user')
  async sendResetPasswordEmail(@Body() body: { email: string; egn: string; newPassword: string }): Promise<void> {
    return await this.authService.sendResetPasswordEmail(body.email, body.egn, body.newPassword)
  }

  @Patch('./forgotten-password/user')
  async resetPassword(@Body() body: { newPassword: string }) {
    //TODO - set a reset password
  }
}
