import { Body, Controller, Post, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@policy/contracts';
import { RMQService } from 'nestjs-rmq';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly rmqService: RMQService
  ) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {
    try {
      return await this.rmqService.send<AccountRegister.Request, AccountRegister.Response>(AccountRegister.topic, data);
    } catch (err) {
      if (err instanceof Error) {
        throw new UnprocessableEntityException(err.message);
      }
    }
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    try {
      return await this.rmqService.send<AccountLogin.Request, AccountLogin.Response>(AccountLogin.topic, data);
    } catch (err) {
      if (err instanceof Error) {
        throw new UnauthorizedException(err.message);
      }
    }
  }
}
