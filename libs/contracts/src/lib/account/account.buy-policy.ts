import { IsString } from 'class-validator';
import { EPaymentStatus } from '@policy/shared/interfaces';

export namespace AccountCheckPayment {
  export const topic = 'account.check-payment.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    policyId: string;
  }
  
  export class Response { 
    status: EPaymentStatus;
  }
}
