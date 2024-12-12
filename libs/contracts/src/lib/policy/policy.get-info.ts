import { IsString } from 'class-validator';
import { IPolicy } from '@policy/shared/interfaces';

export namespace PolicyGetInfo {
  export const topic = 'policy.get-info.query';

  export class Request {
    @IsString()
    id: string;
  }
  
  export class Response { 
    policy: IPolicy | null;
  }
}
