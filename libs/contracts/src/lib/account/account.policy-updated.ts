import { IsString } from 'class-validator';
import { EPurchaseState } from '@policy/shared/interfaces';

export namespace AccountPolicyUpdated {
  export const topic = 'account.policy-updated.event';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    policyId: string;

    @IsString()
    state: EPurchaseState;
  }
}
