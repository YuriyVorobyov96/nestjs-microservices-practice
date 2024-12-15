import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from './user.module';
import { getMongoConfig } from '../config/mongo.config';
import { UserRepository } from './repositories/user.repository';
import { AccountBuyPolicy, AccountCheckPayment, AccountLogin, AccountRegister, AccountUserInfo, PaymentCheck, PaymentGenerateLink, PolicyGetInfo } from '@policy/contracts';
import { authLoginFixture, authRegisterFixture, paymentCheckFixture, paymentLinkFixture, policyInfoFixture } from './user.controller.fixture';
import { verify } from 'jsonwebtoken';

describe('UserController', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let rmqService: RMQTestService;
  let configService: ConfigService;
  let userId: string;

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
    configService = app.get<ConfigService>(ConfigService);

    await app.init();

    await rmqService.triggerRoute<AccountRegister.Request, AccountRegister.Response>(
      AccountRegister.topic,
      authRegisterFixture,
    );

    const { accessToken } = await rmqService.triggerRoute<AccountLogin.Request, AccountLogin.Response>(
      AccountLogin.topic,
      authLoginFixture,
    );

    const data = verify(accessToken, configService.get('JWT_SECRET'));

    userId = data['id'];
  });

  it('AccountUserInfo', async () => {
    const res = await rmqService.triggerRoute<AccountUserInfo.Request, AccountUserInfo.Response>(
      AccountUserInfo.topic,
      { id: userId },
    )

    expect(res.user.name).toEqual(authRegisterFixture.name);
  });

  it('BuyPolicy', async () => {
    rmqService.mockReply<PolicyGetInfo.Response>(PolicyGetInfo.topic, policyInfoFixture);
    rmqService.mockReply<PaymentGenerateLink.Response>(PaymentGenerateLink.topic, paymentLinkFixture);

    const res = await rmqService.triggerRoute<AccountBuyPolicy.Request, AccountBuyPolicy.Response>(
      AccountBuyPolicy.topic,
      { userId, policyId: policyInfoFixture.policy._id },
    )

    expect(res.paymentLink).toEqual(paymentLinkFixture.paymentLink);
  });

  it('CheckPayment', async () => {
    rmqService.mockReply<PaymentCheck.Response>(PaymentCheck.topic, paymentCheckFixture);

    const res = await rmqService.triggerRoute<AccountCheckPayment.Request, AccountCheckPayment.Response>(
      AccountCheckPayment.topic,
      { userId, policyId: policyInfoFixture.policy._id },
    )

    expect(res.status).toEqual(paymentCheckFixture.status);
  });

  afterAll(async () => {
    await userRepository.deleteUser(authRegisterFixture.email);
  });
});
