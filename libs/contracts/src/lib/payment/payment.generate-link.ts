import { IsNumber, IsString } from 'class-validator';

export namespace PaymentGenerateLink {
  export const topic = 'payment.generate-link.query';

  export class Request {
    @IsString()
    policyId: string;

    @IsString()
    userId: string;

    @IsNumber()
    sum: number;
  }
  
  export class Response { 
    paymentLink: string;
  }
}
