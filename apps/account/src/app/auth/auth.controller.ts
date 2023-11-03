import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountLogin, AccountRegister } from '@policy/contracts';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('register')
  async register(dto: AccountRegister.Request): Promise<AccountRegister.Response> {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(dto: AccountLogin.Request): Promise<AccountLogin.Response> {
    return this.authService.login(dto);
  }
}
