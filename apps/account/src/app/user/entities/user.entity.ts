import { compare, genSalt, hash } from 'bcrypt';
import { IUser, EUserRole, IUserPolicy, EPurchaseState, IDomainEvent } from '@policy/shared/interfaces';
import { AccountPolicyUpdated } from '@policy/contracts';

export class UserEntity implements IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: EUserRole;
  policies?: IUserPolicy[];
  events: IDomainEvent[] = [];

  constructor(user: IUser) {
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.passwordHash = user.passwordHash;
    this.role = user.role;
    this.policies = user.policies;
  }

  public setPolicyStatus(policyId: string, state: EPurchaseState): UserEntity {
    const existingPolicy = this.getPolicy(policyId);

    if (!existingPolicy) {
      this.addPolicy(policyId);

      return this;
    }

    if (state === EPurchaseState.Canceled) {
      this.deletePolicy(policyId);

      return this;
    }

    this.policies = this.policies.map(p => {
      if (p.policyId !== policyId) {
        p.purchaseState = state;

        return p;
      }

      return p;
    });

    this.events.push({
      topic: AccountPolicyUpdated.topic,
      data: {
        userId: this._id,
        policyId,
        state,
      },
    });

    return this;
  }

  public async setPassword(password: string): Promise<UserEntity> {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);

    return this;
  }

  public validatePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }

  public updateProfile(name: string): UserEntity {
    this.name = name;

    return this;
  }

  private addPolicy(policyId: string): void {
    this.policies.push({
      policyId,
      purchaseState: EPurchaseState.Started,
    });
  }

  private deletePolicy(policyId: string): void {
    this.policies = this.policies.filter(p => p.policyId !== policyId);
  }

  private getPolicy(policyId: string): IUserPolicy {
    return this.policies.find(p => p.policyId === policyId);
  }
}
