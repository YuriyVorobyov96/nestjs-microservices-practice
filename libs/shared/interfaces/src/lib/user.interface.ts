export enum EUserRole {
  FinWorker = 'FinWorker',
  Client = 'Client',
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: EUserRole;
}
