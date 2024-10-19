import { IsString } from 'class-validator';
import { IUser } from '@policy/shared/interfaces';

export namespace AccountUpdateProfile {
  export const topic = 'account.update-profile.command';

  export class Request {
    @IsString()
    id: string;

    @IsString()
    user: Pick<IUser, 'name'>;
  }
  
  export class Response {}
}
