import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { getMongoConfig } from '../config/mongo.config';
import { UserRepository } from '../user/repositories/user.repository';
import { AccountLogin, AccountRegister } from '@policy/contracts';
import { authLoginFixture, authRegisterFixture } from './auth.controller.fixture';

describe('AuthController', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let rmqService: RMQTestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: 'env/.account.env' }),
        RMQModule.forTest({}),
        UserModule,
        AuthModule,
        MongooseModule.forRootAsync(getMongoConfig()),
      ]
    }).compile();

    app = module.createNestApplication();
    userRepository = app.get<UserRepository>(UserRepository);
    rmqService = app.get(RMQService);

    await app.init();
  });

  it('Register', async () => {
    const res = await rmqService.triggerRoute<AccountRegister.Request, AccountRegister.Response>(
      AccountRegister.topic,
      authRegisterFixture,
    );

    expect(res.email).toEqual(authRegisterFixture.email);
  });

  it('Login', async () => {
    const res = await rmqService.triggerRoute<AccountLogin.Request, AccountLogin.Response>(
      AccountLogin.topic,
      authLoginFixture,
    );

    expect(res.accessToken).toBeDefined();
  });

  afterAll(async () => {
    await userRepository.deleteUser(authRegisterFixture.email);
  });
});
