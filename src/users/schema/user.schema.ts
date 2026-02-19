import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true }) // 👈 จะได้ createdAt / updatedAt อัตโนมัติ
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  refreshTokenHash?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
