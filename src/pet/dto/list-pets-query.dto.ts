import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PetEnum } from 'src/enums/petEnum';
import { PetAge } from 'src/enums/pet-age.enum';
import { PetSize } from 'src/enums/pet-size.enum';
import { EnergyLevel } from 'src/enums/energy-level.enum';
import { IndependenceLevel } from 'src/enums/independence-level.enum';
import { PetEnvironment } from 'src/enums/pet-environment.enum';

export class ListPetsQueryDto {
  @IsNotEmpty({ message: 'A cidade é obrigatória para listar os pets' })
  @IsString()
  city: string;

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
  @IsEnum(PetEnum, { message: 'Espécie deve ser um tipo válido' })
  especie?: PetEnum;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsPositive({ message: 'page deve ser um número positivo' })
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsPositive({ message: 'limit deve ser um número positivo' })
  @Max(100, { message: 'limit máximo é 100' })
  limit?: number = 20;
}
