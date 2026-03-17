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
import { PetService } from './pet.service';

@Controller('/pets')
export class PetController {
  constructor(
    private petRepository: PetRepository,
    private petService: PetService,
  ) {}

  @Post()
  async createPet(@Body() body: CreatePetDto) {
    const petEntity = new PetEntity();
    petEntity.name = body.name;
    petEntity.especie = body.especie;
    petEntity.adotado = body.adotado;
    petEntity.id = uuid();
    await this.petService.createPet(petEntity);
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
    const savedPets = await this.petService.findAllPets();
    return savedPets;
  }

  @Put('/:id')
  async updatePet(@Param('id') id: string, @Body() newPet: UpdatePetDto) {
    const petUpdated = await this.petService.updatePet(id, newPet);
    return {
      petUpdated,
      message: 'Pet updated',
    };
  }

  @Delete('/:id')
  async deletePet(@Param('id') id: string) {
    const petDeleted = await this.petService.deletePet(id);
    return {
      petDeleted,
      message: 'Pet deleted',
    };
  }
}
