import { PetEnum } from 'src/enums/petEnum';
import { PetStatus } from 'src/enums/pet-status.enum';

export class PetListDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly especie: PetEnum,
    readonly status: PetStatus,
  ) {}
}
