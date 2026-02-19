import { Type } from 'class-transformer';
import { IsString, IsNumber,IsOptional } from 'class-validator';

export class UpdateRoomDto {
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
