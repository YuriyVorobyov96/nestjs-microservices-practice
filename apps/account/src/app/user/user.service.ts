import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { AccountBuyPolicy, AccountCheckPayment, AccountUpdateProfile, AccountUserInfo, AccountUserPolicies } from '@policy/contracts';
import { BuyPolicySaga } from './sagas/buy-policy.saga';
import { RMQService } from 'nestjs-rmq';
import { UserEventEmitter } from './user.event-emitter';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userEventEmitter: UserEventEmitter,
    private readonly rmqService: RMQService,
  ) {}

  async getUserInfo({ id }: AccountUserInfo.Request): Promise<AccountUserInfo.Response> {
    const user = await this.userRepository.findUserById(id);

    return {
      user,
    };
  }

  async getUserPolicies({ id }: AccountUserPolicies.Request): Promise<AccountUserPolicies.Response> {
    const user = await this.userRepository.findUserById(id);

    return {
      policies: user.policies,
    };
  }

  async updateUser({id, user}: AccountUpdateProfile.Request): Promise<AccountUpdateProfile.Response> {
    const existingUser = await this.userRepository.findUserById(id);

    if (!existingUser) {
      throw new Error(`User doesn't exist`);
    }

    const userEntity = new UserEntity(existingUser).updateProfile(user.name);

    await this.consistentUserUpdate(userEntity);

    return {};
  }

  async buyPolicy({ userId, policyId }: AccountBuyPolicy.Request): Promise<AccountBuyPolicy.Response> {
    const existingUser = await this.userRepository.findUserById(userId);

    if (!existingUser) {
      throw new Error(`User doesn't exist`);
    }

    const userEntity = new UserEntity(existingUser);
    const saga = new BuyPolicySaga(userEntity, policyId, this.rmqService);

    const { user, paymentLink } = await saga.getState().pay();

    await this.consistentUserUpdate(user as UserEntity);

    return { paymentLink };
  }

  async checkPayment({ userId, policyId }: AccountCheckPayment.Request): Promise<AccountCheckPayment.Response> {
    const existingUser = await this.userRepository.findUserById(userId);

    if (!existingUser) {
      throw new Error(`User doesn't exist`);
    }

    const userEntity = new UserEntity(existingUser);
    const saga = new BuyPolicySaga(userEntity, policyId, this.rmqService);

    const { user, status } = await saga.getState().checkPayment();

    await this.consistentUserUpdate(user as UserEntity);

    return { status };
  }

  private consistentUserUpdate(user: UserEntity) {
    return Promise.all([
      this.userEventEmitter.handle(user),
      this.userRepository.updateUser(user),
    ]);
  }
}
