import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
  } from 'class-validator';
  
  export class CreateUserDto {
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    readonly password: string;
  
    @IsEmail()
    @MaxLength(30)
    @IsNotEmpty()
    readonly email: string;
  }
  