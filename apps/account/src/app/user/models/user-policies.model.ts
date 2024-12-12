import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EPurchaseState, IUserPolicy } from '@policy/shared/interfaces';

@Schema()
export class UserPolicies extends Document implements IUserPolicy {
  @Prop({ required: true })
  policyId: string;

  @Prop({ required: true, enum: EPurchaseState, type: String, default: EPurchaseState.Started })
  purchaseState: EPurchaseState;
}

export const UserPoliciesSchema = SchemaFactory.createForClass(UserPolicies);
