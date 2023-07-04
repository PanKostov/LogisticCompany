import { Controller, Body, Post } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/signup')
  createUser(@Body() body: any) {
    this.accountService.create(body.email, body.password);
  }
}
