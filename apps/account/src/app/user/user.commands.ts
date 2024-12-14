import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountBuyPolicy, AccountCheckPayment, AccountUpdateProfile } from '@policy/contracts';
import { UserService } from './user.service';

@Controller()
export class UserCommands {
  constructor(private readonly userService: UserService) {}

  @RMQRoute(AccountUpdateProfile.topic)
  @RMQValidate()
  async updateUser(@Body() { id, user }: AccountUpdateProfile.Request): Promise<AccountUpdateProfile.Response> {
    return this.userService.updateUser({ id, user });
  }

  @RMQRoute(AccountBuyPolicy.topic)
  @RMQValidate()
  async buyPolicy(@Body() { userId, policyId }: AccountBuyPolicy.Request): Promise<AccountBuyPolicy.Response> {
    return this.userService.buyPolicy({ userId, policyId });
  }

  @RMQRoute(AccountCheckPayment.topic)
  @RMQValidate()
  async checkPayment(@Body() { userId, policyId }: AccountCheckPayment.Request): Promise<AccountCheckPayment.Response> {
    return this.userService.checkPayment({ userId, policyId });
  }
}
