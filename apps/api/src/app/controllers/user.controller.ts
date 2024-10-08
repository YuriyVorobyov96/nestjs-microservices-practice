import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@policy/contracts';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor() {}

  @UseGuards(JWTAuthGuard)
  @Get('info')
  async info(@UserId() userId: string) {}
}
