import { IsEmail, IsString, MinLength, MaxLength, IsStrongPassword } from 'class-validator'

export class UserDto {
  @IsEmail()
  email: string

  @MaxLength(50)
  @IsStrongPassword({ minLength: 8, minSymbols: 1, minNumbers: 1, minLowercase: 1, minUppercase: 1 })
  password: string
}
