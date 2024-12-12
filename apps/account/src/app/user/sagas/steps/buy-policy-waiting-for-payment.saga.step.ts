import { PaymentCheck } from '@policy/contracts';
import { EPaymentStatus, EPurchaseState } from '@policy/shared/interfaces';
import { UserEntity } from '../../entities/user.entity';
import { ABuyPolicySagaState } from '../buy-policy.saga.state';

export class BuyPolicySagaStateWaitingForPayment extends ABuyPolicySagaState {
  public pay(): never {
    throw new Error('Payment already exists');
  }

  public async checkPayment(): Promise<{ user: UserEntity }> {
    const { status } = await this.saga.rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(PaymentCheck.topic, {
      policyId: this.saga.policyId,
      userId: this.saga.user._id,
    });

    if (!status) {
      throw new Error(`Payment doesn't exist`);
    }

    if (status === EPaymentStatus.Success) {
      this.saga.setState(EPurchaseState.Purchased, this.saga.policyId);
    }

    if (status === EPaymentStatus.Canceled) {
      this.saga.setState(EPurchaseState.Canceled, this.saga.policyId);
    }

    return { user: this.saga.user };
  }

  public cancel(): { user: UserEntity } {
    this.saga.setState(EPurchaseState.Canceled, this.saga.policyId);

    return { user: this.saga.user };
  }
}
