import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    user: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true })
    room: mongoose.Types.ObjectId;

    @Prop({ required: true })
    date: string;

    @Prop({ required: true })
    startTime: string;

    @Prop({ required: true })
    endTime: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
