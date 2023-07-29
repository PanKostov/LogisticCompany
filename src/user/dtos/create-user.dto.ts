import { IsBoolean, IsString, IsOptional } from 'class-validator';
import { UserDto } from './user.dto';

export class CreateUserDto extends UserDto {
  @IsString()
  @IsOptional()
  userName?: string;

  @IsString()
  egn: string;
}
