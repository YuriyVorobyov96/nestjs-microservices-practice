import { IUserPayInfo } from '@policy/shared/interfaces';
import { UserEntity } from '../entities/user.entity';
import { BuyPolicySaga } from './buy-policy.saga';

export abstract class ABuyPolicySagaState {
  public saga: BuyPolicySaga;

  public setContext(saga: BuyPolicySaga) {
    this.saga = saga;
  }

  public abstract pay(): Promise<IUserPayInfo>;
  public abstract checkPayment(): Promise<{ user: UserEntity }>;
  public abstract cancel(): { user: UserEntity };
}