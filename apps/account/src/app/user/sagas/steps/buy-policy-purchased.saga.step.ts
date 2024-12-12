import { ABuyPolicySagaState } from '../buy-policy.saga.state';

export class BuyPolicySagaStatePurchased extends ABuyPolicySagaState {
  public pay(): never {
    throw new Error(`Can't generate payment link with purchase status: "Purchased"`);
  }

  public checkPayment(): never {
    throw new Error(`Can't check payment status with purchase status: "Purchased"`);
  }

  public cancel(): never {
    throw new Error(`Can't cancel policy payment with purchase status: "Purchased"`);
  }
}
