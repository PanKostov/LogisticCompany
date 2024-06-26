import { Module } from '@nestjs/common'
import { UserModule } from '../user/UserModule'
import { AuthenticationController } from './AuthenticationController'
import { AuthenticationService } from './AuthenticationService'
import { EncryptionService } from '../encryption-service/EncryptionService'
import { EmailService } from '../email/EmailService'
import { EmailModule } from '../email/EmailModule'

@Module({
  imports: [UserModule, EmailModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, EncryptionService],
})
export class AuthenticationModule {}
