import { compare, genSalt, hash } from 'bcrypt';
import { IUser, EUserRole, IUserPolicies } from '@policy/shared/interfaces';

export class UserEntity implements IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: EUserRole;
  policies?: IUserPolicies[];

  constructor(user: IUser) {
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.passwordHash = user.passwordHash;
    this.role = user.role;
    this.policies = user.policies;
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
}
