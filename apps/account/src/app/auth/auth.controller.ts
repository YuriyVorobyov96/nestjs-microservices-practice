import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('register')
  async register(dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(dto: LoginDto) {
    return this.authService.login(dto);
  }
}

export class RegisterDto {
  name: string;
  email: string;
  password: string;
}

export class LoginDto {
  email: string;
  password: string;
}