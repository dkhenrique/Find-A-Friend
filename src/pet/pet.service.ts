import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetEntity } from './pet.entity';
import { Repository } from 'typeorm';
import { PetListDto } from './dto/PetList.dto';
import { UpdatePetDto } from './dto/UpdatePet.dto';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(PetEntity)
    private readonly petRepository: Repository<PetEntity>,
  ) {}

  async createPet(petEntity: PetEntity) {
    await this.petRepository.save(petEntity);
  }

  async findAllPets() {
    const savedPets = await this.petRepository.find();
    const petList = savedPets.map(
      (pet) => new PetListDto(pet.id, pet.name, pet.especie, pet.adotado),
    );
    return petList;
  }

  async updatePet(id: string, petEntity: UpdatePetDto) {
    await this.petRepository.update(id, petEntity);
  }

  async deletePet(id: string) {
    await this.petRepository.delete(id);
  }
}
