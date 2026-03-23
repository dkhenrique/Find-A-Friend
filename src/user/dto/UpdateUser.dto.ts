import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EmailIsUnique } from '../validator/email-is-unique.validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEmail(undefined, { message: 'Email inválido' })
  @IsOptional()
  @EmailIsUnique({ message: 'Este email já existe na base de dados' })
  email?: string;

  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @IsOptional()
  password?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2, { message: 'Estado deve ter no máximo 2 caracteres (UF)' })
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;
}
