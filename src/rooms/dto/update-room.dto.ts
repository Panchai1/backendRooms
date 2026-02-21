import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsString, IsNumber,IsOptional } from 'class-validator';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto){
    @IsString()
    readonly name?: string;
    @IsString()
    readonly description?: string;
    @IsNumber()
    @Type(() => Number)
    readonly capacity?: number;
    @IsString()
    readonly location?: string;
}
