import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountUserInfo, AccountUserPolicies } from '@policy/contracts';
import { UserService } from './user.service';

@Controller()
export class UserQueries {
  constructor(private readonly userService: UserService) {}

  @RMQRoute(AccountUserInfo.topic)
  @RMQValidate()
  async getUserInfo(@Body() { id }: AccountUserInfo.Request): Promise<AccountUserInfo.Response> {
    return this.userService.getUserInfo({ id });
  }

  @RMQRoute(AccountUserPolicies.topic)
  @RMQValidate()
  async getUserPolicies(@Body() { id }: AccountUserPolicies.Request): Promise<AccountUserPolicies.Response> {
    return this.userService.getUserPolicies({ id });
  }
}
