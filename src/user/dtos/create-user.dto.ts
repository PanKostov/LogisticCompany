import {
  Contains,
  IsBoolean,
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  //@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'password too weak',
  //})
  password: string;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsString()
  egn: string;

  @IsBoolean()
  isEmployee: boolean;
}
