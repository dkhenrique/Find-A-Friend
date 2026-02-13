import { Body, Controller, Get, Post } from '@nestjs/common';
import { PetRepository } from './pet.repository';
import { CreatePetDto } from './dto/CreatePet.dto';

@Controller('/pets')
export class PetController {
  constructor(private petRepository: PetRepository) {}

  @Post()
  async createPet(@Body() body: CreatePetDto) {
    await this.petRepository.create(body);
    return { message: 'Pet created' };
  }

  @Get()
  async listPets() {
    return this.petRepository.list();
  }
}
