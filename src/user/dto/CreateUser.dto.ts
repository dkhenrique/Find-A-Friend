import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { EmailIsUnique } from '../validator/email-is-unique.validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  name: string;

  @IsEmail(undefined, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @EmailIsUnique({ message: 'Este email já existe na base de dados' })
  email: string;

  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;

  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  @IsString()
  address: string;

  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString()
  city: string;

  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @IsString()
  @MaxLength(2, { message: 'Estado deve ter no máximo 2 caracteres (UF)' })
  state: string;

  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @IsString()
  zipCode: string;

  @IsNotEmpty({ message: 'WhatsApp é obrigatório' })
  @IsString()
  @Matches(/^\d{10,13}$/, {
    message: 'WhatsApp deve conter apenas dígitos (10 a 13 caracteres)',
  })
  whatsapp: string;
}
