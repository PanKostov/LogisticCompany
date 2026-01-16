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
  fromAddress?: string

  @IsOptional()
  @IsString()
  toAddress?: string

  @IsOptional()
  @IsNumber()
  weight?: number

  @IsOptional()
  @IsNumber()
  employeeId?: number

  @IsOptional()
  @IsBoolean()
  isReceived?: boolean
}
