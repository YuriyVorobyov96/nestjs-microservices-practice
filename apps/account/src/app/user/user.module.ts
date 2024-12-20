import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { UserRepository } from './repositories/user.repository';
import { UserCommands } from './user.commands';
import { UserEventEmitter } from './user.event-emitter';
import { UserQueries } from './user.queries';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: UserSchema }
  ])],
  providers: [UserService, UserRepository, UserEventEmitter],
  exports: [UserRepository],
  controllers: [UserCommands, UserQueries],
})
export class UserModule {}
