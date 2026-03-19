import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePetRequirementDto {
  @IsNotEmpty({ message: 'O título do requisito é obrigatório' })
  @IsString()
  title: string;
}
