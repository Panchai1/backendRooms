import {Prop,Schema,SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type RoomDocument = Room & Document;

@Schema()
export class Room {
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    description: string;

    @Prop({required: true})
    capacity: number;

    @Prop({required: true}) 
    location: string;

    @Prop({type:[String], required: true})
    images: string[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);