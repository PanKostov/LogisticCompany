import { Module } from '@nestjs/common'
import { UserModule } from '../user/UserModule'
import { AuthenticationController } from './AuthenticationController'
import { AuthenticationService } from './AuthenticationService'
import { EncryptionService } from '../encryption-service/EncryptionService'
import { EmailService } from '../email/EmailService'

@Module({
  imports: [UserModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, EncryptionService, EmailService],
})
export class AuthenticationModule {}
