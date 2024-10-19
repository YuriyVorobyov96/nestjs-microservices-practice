import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountUpdateProfile } from '@policy/contracts';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserCommands {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  @RMQRoute(AccountUpdateProfile.topic)
  @RMQValidate()
  async getUserInfo(@Body() { id, user }: AccountUpdateProfile.Request): Promise<AccountUpdateProfile.Response> {
    const existingUser = await this.userRepository.findUserById(id);

    if (!existingUser) {
      throw new Error(`User doesn't exist`);
    }

    const userEntity = new UserEntity(existingUser).updateProfile(user.name);

    await this.userRepository.updateUser(userEntity);

    return {};
  }
}
