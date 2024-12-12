import { EPurchaseState, IUserPayInfo } from '@policy/shared/interfaces';
import { ABuyPolicySagaState } from '../buy-policy.saga.state';

export class BuyPolicySagaStateCanceled extends ABuyPolicySagaState {
  public async pay(): Promise<IUserPayInfo> {
    this.saga.setState(EPurchaseState.Started, this.saga.policyId);

    return this.saga.getState().pay();
  }

  public checkPayment(): never {
    throw new Error(`Payment doesn't exist`);
  }

  public cancel(): never {
    throw new Error(`Can't cancel policy payment with purchase status: "Canceled"`);
  }
}
