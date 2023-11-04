import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountLogin, AccountRegister } from '@policy/contracts';
import { RMQRoute } from 'nestjs-rmq';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @RMQRoute(AccountRegister.topic)
  async register(dto: AccountRegister.Request): Promise<AccountRegister.Response> {
    return this.authService.register(dto);
  }

  @RMQRoute(AccountLogin.topic)
  async login(dto: AccountLogin.Request): Promise<AccountLogin.Response> {
    return this.authService.login(dto);
  }
}
