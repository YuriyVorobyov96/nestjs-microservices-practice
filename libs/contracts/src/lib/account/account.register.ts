import { IsEmail, IsString } from 'class-validator';

export namespace AccountRegister {
  export const topic = 'account.register.command';

  export class Request {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
  }
  
  export class Response {
    email: string;
  }
}
