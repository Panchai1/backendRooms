import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {

  @IsNotEmpty()
   readonly name: string;

  @IsEmail()
   readonly email: string;

  @MinLength(6)
  readonly password: string;
}
