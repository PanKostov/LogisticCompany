import { IsString, IsOptional } from 'class-validator'
import { UserDto } from './UserDto.dto'
import { IsEgnValid } from '../../pipes/egn/EgnValidationDecorator'

export class CreateUserDto extends UserDto {
  @IsString()
  @IsOptional()
  userName?: string

  @IsString()
  //Disable while testing
  //@IsEgnValid()
  egn: string
}
