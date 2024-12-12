import { PaymentGenerateLink, PolicyGetInfo } from '@policy/contracts';
import { EPurchaseState, IUserPayInfo } from '@policy/shared/interfaces';
import { UserEntity } from '../../entities/user.entity';
import { ABuyPolicySagaState } from '../buy-policy.saga.state';

export class BuyPolicySagaStateStarted extends ABuyPolicySagaState {
  public async pay(): Promise<IUserPayInfo> {
    const { policy } = await this.saga.rmqService.send<PolicyGetInfo.Request, PolicyGetInfo.Response>(PolicyGetInfo.topic, {
      id: this.saga.policyId
    });

    if (!policy) {
      throw new Error(`This policy doesn't exist`);
    }

    if (policy.price === 0) {
      throw new Error('Internal error');
    }

    const { paymentLink } = await this.saga.rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
      policyId: this.saga.policyId,
      userId: this.saga.user._id,
      sum: policy.price,
    });

    this.saga.setState(EPurchaseState.WaitingForPayment, policy._id);

    return { paymentLink, user: this.saga.user };
  }

  public checkPayment(): never {
    throw new Error(`Payment doesn't exist`);
  }

  public cancel(): { user: UserEntity } {
    this.saga.setState(EPurchaseState.Canceled, this.saga.policyId);

    return { user: this.saga.user };
  }
}
