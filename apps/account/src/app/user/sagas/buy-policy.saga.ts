import { RMQService } from 'nestjs-rmq';
import { UserEntity } from '../entities/user.entity';
import { EPurchaseState } from '@policy/shared/interfaces';
import { ABuyPolicySagaState } from './buy-policy.saga.state';
import { BuyPolicySagaStateCanceled, BuyPolicySagaStatePurchased, BuyPolicySagaStateWaitingForPayment, BuyPolicySagaStateStarted } from './steps';

export class BuyPolicySaga {
  private state: ABuyPolicySagaState;

  constructor(public user: UserEntity, public policyId: string, public rmqService: RMQService) {}

  setState(state: EPurchaseState, policyId: string) {
    switch (state) {
      case EPurchaseState.Started:
        this.state = new BuyPolicySagaStateStarted();
        break;
      case EPurchaseState.WaitingForPayment:
        this.state = new BuyPolicySagaStateWaitingForPayment();
        break;
      case EPurchaseState.Purchased:
        this.state = new BuyPolicySagaStatePurchased();
        break;
      case EPurchaseState.Canceled:
        this.state = new BuyPolicySagaStateCanceled();
        break;
    }

    this.state.setContext(this);
    this.user.setPolicyStatus(policyId, state);
  }
  
  getState() {
    return this.state;
  }
}
