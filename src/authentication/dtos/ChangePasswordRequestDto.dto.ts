import { IsStrongPassword, MaxLength } from 'class-validator'

export class ChangePasswordRequestDto {
  oldPassword: string

  @MaxLength(50)
  @IsStrongPassword({ minLength: 8, minSymbols: 1, minNumbers: 1, minLowercase: 1, minUppercase: 1 })
  newPassword: string
}
