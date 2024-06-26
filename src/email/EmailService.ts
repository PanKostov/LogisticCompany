import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { User } from '../user/User.entity'

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendUserWelcome(user: User, token: string) {
    const confirmation_url = `example.com/auth/confirm?token=${token}`

    await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <mailtrap@demomailtrap.com>', // override default from
      subject: 'Welcome to Logistic Company! Confirm your Email',
      template: '../../email-templates/welcome', // `.ejs` extension is appended automatically
      context: {
        // filling <%= %> brackets with content
        name: user.userName,
        confirmation_url,
      },
    })
  }
}
