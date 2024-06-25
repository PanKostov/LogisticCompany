import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './UserController'
import { UserService } from './UserService'
import { User } from './User.entity'
import { CustomerModule } from '../customer/CustomerModule'
import { UserAdminController } from './UserAdminController'
import { EncryptionService } from '../encryption-service/EncryptionService'

@Module({
  imports: [TypeOrmModule.forFeature([User]), CustomerModule],
  controllers: [UserController, UserAdminController],
  providers: [UserService, EncryptionService],
  exports: [UserService],
})
export class UserModule {}
