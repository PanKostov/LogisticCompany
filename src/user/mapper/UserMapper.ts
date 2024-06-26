import { User } from '../User.entity'
import { UserResponseDto } from '../dtos/UserResponseDto.dto'

export class UserMapper {
  static toDto(user: User): UserResponseDto {
    let dtoResponse: UserResponseDto = new UserResponseDto()

    dtoResponse.email = user.email
    dtoResponse.userName = user.userName

    return dtoResponse
  }
}
