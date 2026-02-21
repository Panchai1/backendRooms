import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()      // ต้องมี Decorator ทุกตัว
  @IsNotEmpty()    // เพื่อบอกว่าห้ามว่าง
  readonly room: string;

  // @IsString()
  // @IsNotEmpty()
  // readonly bookedBy: string;

  @IsString()
  @IsNotEmpty()
  readonly date: string;

  @IsString()
  @IsNotEmpty()
  readonly startTime: string;

  @IsString()
  @IsNotEmpty()
  readonly endTime: string;
}