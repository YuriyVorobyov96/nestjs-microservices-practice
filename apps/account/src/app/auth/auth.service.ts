import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { UserEntity } from '../user/entities/user.entity';
import { EUserRole } from '@policy/shared/interfaces';
import { AccountLogin, AccountRegister } from '@policy/contracts';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register({ email, password, name }: AccountRegister.Request): Promise<AccountRegister.Response> {
    const existingUser = await this.userRepository.findUserByEmail(email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await new UserEntity({
      name,
      email,
      role: EUserRole.Client,
      passwordHash: '',
    }).setPassword(password);

    const newUser = await this.userRepository.createUser(user);

    return { email: newUser.email };
  }

  async login({ email, password }: AccountLogin.Request): Promise<AccountLogin.Response> {
    const { id } = await this.validateUser(email, password);

    return this.signJwt(id);
  }

  private async signJwt(id: string) {
    return {
      accessToken: await this.jwtService.signAsync({ id }),
    };
  }

  private async validateUser(email: string, password: string) {
    const errorMessage = 'Invalid email or password';

    const existingUser = await this.userRepository.findUserByEmail(email);

    if (!existingUser) {
      throw new Error(errorMessage);
    }

    const user = new UserEntity(existingUser);
    const isCorrectPassword = await user.validatePassword(password);

    if (!isCorrectPassword) {
      throw new Error(errorMessage);
    }

    return { id: user._id };
  }
}
