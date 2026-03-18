import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetEntity } from './pet.entity';
import { Repository } from 'typeorm';
import { PetListDto } from './dto/PetList.dto';
import { UpdatePetDto } from './dto/UpdatePet.dto';
import { CreatePetDto } from './dto/CreatePet.dto';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(PetEntity)
    private readonly petRepository: Repository<PetEntity>,
  ) {}

  async createPet(dto: CreatePetDto): Promise<PetListDto> {
    const pet = this.petRepository.create(dto);
    const saved = await this.petRepository.save(pet);
    return new PetListDto(saved.id, saved.name, saved.especie, saved.adotado);
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
