import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdatePacketDto {
  @IsOptional()
  @IsNumber()
  senderId?: number

  @IsOptional()
  @IsNumber()
  receiverId?: number

  @IsOptional()
  @IsNumber()
  fromOfficeId?: number

  @IsOptional()
  @IsNumber()
  toOfficeId?: number

  @IsOptional()
  @IsString()
  fromAdress?: string

  @IsOptional()
  @IsString()
  toAdress?: string

  @IsOptional()
  @IsNumber()
  weight?: number

  @IsOptional()
  @IsNumber()
  employeeId?: number

  @IsOptional()
  @IsBoolean()
  isRecieved?: boolean
}
