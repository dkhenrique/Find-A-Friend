import { PetEnum } from 'src/enums/petEnum';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

export class CreatePetDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'O campo espécie é obrigatório' })
  @IsEnum(PetEnum, { message: 'Especie must be a valid pet type' })
  especie: PetEnum;

  @IsBoolean({ message: 'Adotado must be a boolean' })
  adotado: boolean;
}
