import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UserService } from '../user/UserService'
import { UserMapper } from '../user/mapper/UserMapper'
import { UserResponseDto } from '../user/dtos/UserResponseDto.dto'
import { ValidationError } from '../utils/errors/ValidationError'
import { EmailService } from '../email/EmailService'

@Injectable()
export class AuthenticationService {
  constructor(private userService: UserService, private emailService: EmailService) {}

  async signUp(email: string, password: string, egn: string): Promise<UserResponseDto> {
    try {
      const saltOrRounds = await bcrypt.genSalt()
      const passwordHashed = await bcrypt.hash(password, saltOrRounds)

      let user = await this.userService.findByEmail(email)
      user = await this.userService.findByEgn(egn)
      if (user) {
        /* Don't let them know that egn or email is taken */
        return
      }

      const userResponse = await this.userService.createUser(email, passwordHashed, egn, false)
      await this.emailService.sendUserWelcome(user, 'testToken')

      return UserMapper.toDto(userResponse)
    } catch (error) {
      throw new HttpException({ message: error.message }, error.status || HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async signIn(email: string, password: string): Promise<UserResponseDto> {
    try {
      const user = await this.userService.findByEmail(email)
      if (!user) {
        throw new NotFoundException(`User with email: ${email} not found!`)
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        throw new HttpException('Invalid password! ', 400)
      }

      return UserMapper.toDto(user)
    } catch (error) {
      throw new HttpException({ message: error.message }, error.status || HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updatePassword(id: number, oldPassword: string, newPassword: string): Promise<UserResponseDto> {
    try {
      const user = await this.userService.findOne(id)

      if (!user) {
        throw new NotFoundException('User not found!')
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password)
      if (!isMatch) {
        throw new ValidationError('Old password does not match!')
      }

      if (oldPassword === newPassword) {
        throw new ValidationError('New password must be different from the old password.')
      }

      const saltOrRounds = await bcrypt.genSalt()
      const passwordHashed = await bcrypt.hash(newPassword, saltOrRounds)

      const userResponse = await this.userService.updatePassword(id, {
        password: passwordHashed,
      })

      return UserMapper.toDto(userResponse)
    } catch (error) {
      throw new HttpException({ message: error.message }, error.status || HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
