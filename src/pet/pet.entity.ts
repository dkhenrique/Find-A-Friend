import { PetEnum } from 'src/enums/petEnum';

export class PetEntity {
  id: string;
  name: string;
  especie: PetEnum;
  adotado: boolean;
}
