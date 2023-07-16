import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Encryptor } from '../other/encryptor';
import { CustomerModule } from 'src/customer/customer.module';
@Module({
  imports: [TypeOrmModule.forFeature([User]), CustomerModule],
  controllers: [UserController],
  providers: [UserService, Encryptor],
  exports: [UserService],
})
export class UserModule {}
