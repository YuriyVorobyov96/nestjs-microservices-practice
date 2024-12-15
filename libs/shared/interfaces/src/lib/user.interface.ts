export enum EUserRole {
  FinWorker = 'FinWorker',
  Client = 'Client',
}

export enum EPurchaseState {
  Started = 'Started',
  WaitingForPayment = 'WaitingForPayment',
  Purchased = 'Purchased',
  Canceled = 'Canceled',
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: EUserRole;
  policies?: IUserPolicy[];
}

export interface IUserPolicy {
  policyId: string;
  purchaseState: EPurchaseState;
}
