import { Injectable, NotFoundException } from '@nestjs/common';
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

  async update(id: string, pet: Partial<PetEntity>) {
    const petToUpdate = this.pets.find((pet) => pet.id === id);

    if (!petToUpdate) {
      throw new NotFoundException('Pet not found');
    }

    Object.entries(pet).forEach(([key, value]) => {
      if (key === 'id') {
        return;
      }
      petToUpdate[key] = value;
    });

    return petToUpdate;
  }

  async delete(id: string) {
    const petToDelete = this.pets.find((pet) => pet.id === id);

    if (!petToDelete) {
      throw new NotFoundException('Pet not found');
    }

    this.pets = this.pets.filter((pet) => pet.id !== id);

    return petToDelete;
  }
}
