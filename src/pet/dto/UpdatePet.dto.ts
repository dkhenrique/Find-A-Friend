import { PetEnum } from 'src/enums/petEnum';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UpdatePetDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEnum(PetEnum, { message: 'Especie must be a valid pet type' })
  especie: PetEnum;

  @IsOptional()
  @IsBoolean({ message: 'Adotado must be a boolean' })
  adotado: boolean;
}
