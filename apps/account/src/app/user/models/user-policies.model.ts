import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EPurchaseState, IUserPolicies } from '@policy/shared/interfaces';

@Schema()
export class UserPolicies extends Document implements IUserPolicies {
  @Prop({ required: true })
  policyId: string;

  @Prop({ required: true, enum: EPurchaseState, type: String, default: EPurchaseState.Started })
  purchaseState: EPurchaseState;
}

export const UserPoliciesSchema = SchemaFactory.createForClass(UserPolicies);
