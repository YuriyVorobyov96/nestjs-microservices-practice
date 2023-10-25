import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModule: Model<User>
  ) {}

  async createUser(user: UserEntity) {
    const newUser = new this.userModule(user);

    return newUser.save();
  }

  async findUserByEmail(email: string) {
    return this.userModule.findOne({ email }).exec();
  }

  async findUserById(id: string) {
    return this.userModule.findOne({ _id: id }).exec();
  }
}
