import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { Model, UpdateWriteOpResult } from 'mongoose';
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

  async updateUser({ _id, ...rest }: UserEntity): Promise<UpdateWriteOpResult> {
    return this.userModule.updateOne({ _id }, { $set: { ...rest } }).exec();
  }

  async findUserByEmail(email: string) {
    return this.userModule.findOne({ email }).exec();
  }

  async findUserById(id: string) {
    return this.userModule.findById(id).exec();
  }
}
