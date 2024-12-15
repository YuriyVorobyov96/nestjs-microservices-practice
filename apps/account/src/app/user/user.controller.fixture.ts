import { AccountLogin, AccountRegister, PaymentCheck, PaymentGenerateLink, PolicyGetInfo } from '@policy/contracts';
import { EPaymentStatus } from '@policy/shared/interfaces';

export const authLoginFixture: AccountLogin.Request = {
  email: 'test2@test.ru',
  password: 'testingtest',
};

export const authRegisterFixture: AccountRegister.Request = {
  ...authLoginFixture,
  name: 'Test User',
};

export const policyInfoFixture: PolicyGetInfo.Response = {
  policy: {
    _id: 'policy-id-1',
    price: 12345,
  }
}

export const paymentLinkFixture: PaymentGenerateLink.Response = {
  paymentLink: 'test://payment-link.com',
}

export const paymentCheckFixture: PaymentCheck.Response = {
  status: EPaymentStatus.Success,
}
