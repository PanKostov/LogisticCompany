import { IsOptional, IsString, MaxLength } from 'class-validator'

export class CompanyDto {
  @IsString()
  @MaxLength(120)
  name: string

  @IsOptional()
  @IsString()
  @MaxLength(40)
  legalId?: string

  @IsOptional()
  @IsString()
  @MaxLength(160)
  address?: string

  @IsOptional()
  @IsString()
  @MaxLength(120)
  contact?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string
}
