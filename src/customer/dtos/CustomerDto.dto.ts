import { IsAlpha, IsNumberString, IsString, Length } from 'class-validator'
import { IsEgnValid } from '../../pipes/egn/EgnValidationDecorator'

export class CustomerDto {
  @IsString()
  @IsAlpha()
  @Length(1, 60)
  firstName: string

  @IsString()
  @IsAlpha()
  @Length(1, 60)
  lastName: string

  @Length(10, 10, { message: 'egn must be exactly 10 digits' })
  @IsNumberString()
  //TODO: Disable while testing
  //@IsEgnValid()
  egn: string
}
