import { PartialType } from '@nestjs/mapped-types'
import { CompanyDto } from './CompanyDto.dto'

export class UpdateCompanyDto extends PartialType(CompanyDto) {}
