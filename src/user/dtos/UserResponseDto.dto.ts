import { UserAccess } from '../models/UserAccess.enum'

export class UserResponseDto {
  id: number
  email: string
  userName: string
  isEmployee: boolean
  type: UserAccess
}
