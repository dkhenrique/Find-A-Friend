import { IsEmail, MinLength, IsOptional } from 'class-validator';
import { EmailIsUnique } from '../validator/email-is-unique.validator';

export class CreateUserDto {
  @IsOptional()
  name: string;

  @IsEmail(undefined, { message: 'Email is invalid' })
  @IsOptional()
  @EmailIsUnique({ message: 'This email already exists in our database ' })
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsOptional()
  password: string;
}
