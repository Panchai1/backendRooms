import { Type } from 'class-transformer';
import { IsString, IsNumber,IsNotEmpty,Min } from 'class-validator';



export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    readonly capacity: number;

    @IsNotEmpty()
    @IsString()
    readonly location: string;
}
