import { AccountLogin, AccountRegister } from '@policy/contracts';

export const authLoginFixture: AccountLogin.Request = {
  email: 'test@test.ru',
  password: 'testingtest',
};

export const authRegisterFixture: AccountRegister.Request = {
  ...authLoginFixture,
  name: 'Test User',
};
