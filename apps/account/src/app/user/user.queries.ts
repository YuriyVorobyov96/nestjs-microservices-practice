import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountUserInfo, AccountUserPolicies } from '@policy/contracts';
import { UserRepository } from './repositories/user.repository';

@Controller()
export class UserCommands {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  @RMQRoute(AccountUserInfo.topic)
  @RMQValidate()
  async getUserInfo(@Body() { id }: AccountUserInfo.Request): Promise<AccountUserInfo.Response> {
    const user = await this.userRepository.findUserById(id);

    return {
      user,
    };
  }

  @RMQRoute(AccountUserPolicies.topic)
  @RMQValidate()
  async getUserPolicies(@Body() { id }: AccountUserPolicies.Request): Promise<AccountUserPolicies.Response> {
    const user = await this.userRepository.findUserById(id);

    return {
      policies: user.policies,
    };
  }
}
