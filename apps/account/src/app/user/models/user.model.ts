import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser, EUserRole } from '@policy/shared/interfaces';

@Schema()
export class User extends Document implements IUser {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: EUserRole, type: String, default: EUserRole.Client })
  role: EUserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
