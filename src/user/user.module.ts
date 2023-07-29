import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Encryptor } from '../other/encryptor';
import { CustomerModule } from '../customer/customer.module';
@Module({
  imports: [TypeOrmModule.forFeature([User]), CustomerModule],
  controllers: [UserController],
  providers: [UserService, Encryptor],
  exports: [UserService],
})
export class UserModule {}
