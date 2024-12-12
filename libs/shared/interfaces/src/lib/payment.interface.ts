import { IUser } from './user.interface';

export enum EPaymentStatus {
  Canceled = 'Cancelled',
  Success = 'Success',
  Progress = 'Progress',
}

export interface IUserPayInfo {
  paymentLink: string;
  user: IUser;
}

export interface IUserPayStatus {
  status: EPaymentStatus;
  user: IUser;
}
