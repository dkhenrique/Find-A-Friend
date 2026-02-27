import { Injectable } from '@nestjs/common';
import { PetEnum } from 'src/enums/petEnum';
import { PetEntity } from './pet.entity';

export interface Pet {
  name: string;
  especie: PetEnum;
  adotado: boolean;
}

@Injectable()
export class PetRepository {
  private pets: PetEntity[] = [];

  async create(pet: PetEntity) {
    this.pets.push(pet);
  }

  async list() {
    return this.pets;
  }
}
