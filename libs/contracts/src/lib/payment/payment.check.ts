import { IsString } from 'class-validator';
import { EPaymentStatus } from '@policy/shared/interfaces';

export namespace PaymentCheck {
  export const topic = 'payment.check.query';

  export class Request {
    @IsString()
    policyId: string;

    @IsString()
    userId: string;
  }
  
  export class Response { 
    status: EPaymentStatus;
  }
}
