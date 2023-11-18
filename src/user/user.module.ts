import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Encryptor } from '../other/encryptor';
import { CustomerModule } from '../customer/customer.module';
import { UserAdminController } from './user.admin.controller';
@Module({
  imports: [TypeOrmModule.forFeature([User]), CustomerModule],
  controllers: [UserController, UserAdminController],
  providers: [UserService, Encryptor],
  exports: [UserService],
})
export class UserModule {}
