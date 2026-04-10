import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'O refresh_token é obrigatório' })
  @IsString()
  refresh_token: string;
}
