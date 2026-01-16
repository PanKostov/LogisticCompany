import { User } from '../User.entity'
import { UserResponseDto } from '../dtos/UserResponseDto.dto'

export class UserMapper {
  static toDto(user: User): UserResponseDto {
    const dtoResponse: UserResponseDto = new UserResponseDto()

    dtoResponse.id = user.id
    dtoResponse.email = user.email
    dtoResponse.userName = user.userName
    dtoResponse.isEmployee = user.isEmployee
    dtoResponse.type = user.type

    return dtoResponse
  }
}
