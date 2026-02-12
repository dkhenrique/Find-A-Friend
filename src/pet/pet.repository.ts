import { Injectable } from '@nestjs/common';
import { PetEnum } from 'src/enums/petEnum';

export interface Pet {
  name: string;
  especie: PetEnum;
  adotado: boolean;
}

@Injectable()
export class PetRepository {
  private pets: Pet[] = [];

  async create(pet: Pet) {
    await this.pets.push(pet);
  }

  async list() {
    return await this.pets;
  }
}
