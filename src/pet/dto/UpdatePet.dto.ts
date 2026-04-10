import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PetEnum } from 'src/enums/petEnum';
import { PetAge } from 'src/enums/pet-age.enum';
import { PetSize } from 'src/enums/pet-size.enum';
import { EnergyLevel } from 'src/enums/energy-level.enum';
import { IndependenceLevel } from 'src/enums/independence-level.enum';
import { PetEnvironment } from 'src/enums/pet-environment.enum';
import { PetStatus } from 'src/enums/pet-status.enum';

export class UpdatePetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(PetEnum, { message: 'Espécie deve ser um tipo válido de pet' })
  especie?: PetEnum;

  @IsOptional()
  @IsEnum(PetAge, { message: 'Idade deve ser: filhote, adulto ou idoso' })
  age?: PetAge;

  @IsOptional()
  @IsEnum(PetSize, { message: 'Porte deve ser: pequeno, medio ou grande' })
  size?: PetSize;

  @IsOptional()
  @IsEnum(EnergyLevel, {
    message: 'Nível de energia deve ser: baixa, media ou alta',
  })
  energyLevel?: EnergyLevel;

  @IsOptional()
  @IsEnum(IndependenceLevel, {
    message: 'Nível de independência deve ser: baixo, medio ou alto',
  })
  independenceLevel?: IndependenceLevel;

  @IsOptional()
  @IsEnum(PetEnvironment, {
    message: 'Ambiente deve ser: amplo, medio ou pequeno',
  })
  environment?: PetEnvironment;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PetStatus, {
    message: 'Status deve ser: available, in_process ou adopted',
  })
  status?: PetStatus;
}
