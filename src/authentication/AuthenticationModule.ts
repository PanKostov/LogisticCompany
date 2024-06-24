import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './AuthenticationController';
import { AuthenticationService } from './AuthenticationService';
import { EncryptionService } from '../encryption-service/encryption.service';

@Module({
  imports: [UserModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, EncryptionService],
})
export class AuthenticationModule {}
