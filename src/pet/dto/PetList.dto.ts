import { PetEnum } from 'src/enums/petEnum';

export class PetListDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly especie: PetEnum,
    readonly adotado: boolean,
  ) {}
}
