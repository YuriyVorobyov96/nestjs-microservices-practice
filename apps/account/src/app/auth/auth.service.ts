import { Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './auth.controller';
import { UserRepository } from '../user/repositories/user.repository';
import { UserEntity } from '../user/entities/user.entity';
import { EUserRole } from '@policy/shared/interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register({ email, password, name }: RegisterDto): Promise<string> {
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

    return newUser.email;
  }

  async login({ email, password }: LoginDto) {
    const { id } = await this.validateUser(email, password);

    return this.signJwt(id);
  }

  private async signJwt(id: string) {
    return {
      access_token: await this.jwtService.signAsync({ id }),
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
