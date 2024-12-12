import { IsString } from 'class-validator';
import { IUserPolicy } from '@policy/shared/interfaces';

export namespace AccountUserPolicies {
  export const topic = 'account.user-policies.query';

  export class Request {
    @IsString()
    id: string;
  }
  
  export class Response { 
    policies: IUserPolicy[];
  }
}
