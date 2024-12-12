import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQService, RMQValidate } from 'nestjs-rmq';
import { AccountBuyPolicy, AccountCheckPayment, AccountUpdateProfile } from '@policy/contracts';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { BuyPolicySaga } from './sagas/buy-policy.saga';

@Controller()
export class UserCommands {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService,
  ) {}

  @RMQRoute(AccountUpdateProfile.topic)
  @RMQValidate()
  async updateUser(@Body() { id, user }: AccountUpdateProfile.Request): Promise<AccountUpdateProfile.Response> {
    const existingUser = await this.userRepository.findUserById(id);

    if (!existingUser) {
      throw new Error(`User doesn't exist`);
    }

    const userEntity = new UserEntity(existingUser).updateProfile(user.name);

    await this.userRepository.updateUser(userEntity);

    return {};
  }

  @RMQRoute(AccountBuyPolicy.topic)
  @RMQValidate()
  async buyPolicy(@Body() { userId, policyId }: AccountBuyPolicy.Request): Promise<AccountBuyPolicy.Response> {
    const existingUser = await this.userRepository.findUserById(userId);

    if (!existingUser) {
      throw new Error(`User doesn't exist`);
    }

    const userEntity = new UserEntity(existingUser);
    const saga = new BuyPolicySaga(userEntity, policyId, this.rmqService);

    const { user, paymentLink } = await saga.getState().pay();

    await this.userRepository.updateUser(user as UserEntity);

    return { paymentLink };
  }

  @RMQRoute(AccountCheckPayment.topic)
  @RMQValidate()
  async checkPayment(@Body() { userId, policyId }: AccountCheckPayment.Request): Promise<AccountCheckPayment.Response> {
    const existingUser = await this.userRepository.findUserById(userId);

    if (!existingUser) {
      throw new Error(`User doesn't exist`);
    }

    const userEntity = new UserEntity(existingUser);
    const saga = new BuyPolicySaga(userEntity, policyId, this.rmqService);

    const { user, status } = await saga.getState().checkPayment();

    await this.userRepository.updateUser(user as UserEntity);

    return { status };
  }
}
