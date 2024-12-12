import { IsString } from 'class-validator';

export namespace AccountBuyPolicy {
  export const topic = 'account.buy-policy.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    policyId: string;
  }
  
  export class Response { 
    paymentLink: string;
  }
}
