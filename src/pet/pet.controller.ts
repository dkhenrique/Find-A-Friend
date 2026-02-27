import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PetRepository } from './pet.repository';
import { CreatePetDto } from './dto/CreatePet.dto';
import { v4 as uuid } from 'uuid';
import { PetEntity } from './pet.entity';
import { PetListDto } from './dto/PetList.dto';
import { UpdatePetDto } from './dto/UpdatePet.dto';

@Controller('/pets')
export class PetController {
  constructor(private petRepository: PetRepository) {}

  @Post()
  async createPet(@Body() body: CreatePetDto) {
    const petEntity = new PetEntity();
    petEntity.name = body.name;
    petEntity.especie = body.especie;
    petEntity.adotado = body.adotado;
    petEntity.id = uuid();
    await this.petRepository.create(petEntity);
    return {
      pet: new PetListDto(
        petEntity.id,
        petEntity.name,
        petEntity.especie,
        petEntity.adotado,
      ),
      message: 'Pet created',
    };
  }

  @Get()
  async listPets() {
    const savedPets = await this.petRepository.list();
    const petList = savedPets.map(
      (pet) => new PetListDto(pet.id, pet.name, pet.especie, pet.adotado),
    );
    return petList;
  }

  @Put('/:id')
  async updatePet(@Param('id') id: string, @Body() newPet: UpdatePetDto) {
    const petUpdated = await this.petRepository.update(id, newPet);
    return {
      pet: new PetListDto(
        petUpdated.id,
        petUpdated.name,
        petUpdated.especie,
        petUpdated.adotado,
      ),
      message: 'Pet updated',
    };
  }

  @Delete('/:id')
  async deletePet(@Param('id') id: string) {
    const petDeleted = await this.petRepository.delete(id);
    return {
      pet: new PetListDto(
        petDeleted.id,
        petDeleted.name,
        petDeleted.especie,
        petDeleted.adotado,
      ),
      message: 'Pet deleted',
    };
  }
}
