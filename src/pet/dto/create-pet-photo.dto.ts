import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePetPhotoDto {
  @IsNotEmpty({ message: 'A URL da foto é obrigatória' })
  @IsUrl({}, { message: 'URL inválida' })
  url: string;

  @IsOptional()
  @IsString()
  description?: string;
}
