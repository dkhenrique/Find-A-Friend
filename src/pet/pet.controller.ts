import { Body, Controller, Get, Post } from '@nestjs/common';
import { Pet, PetRepository } from './pet.repository';

@Controller('/pets')
export class PetController {
  constructor(private petRepository: PetRepository) {}

  @Post()
  async createPet(@Body() body: Pet) {
    await this.petRepository.create(body);
    return { message: 'Pet created' };
  }

  @Get()
  async listPets() {
    return this.petRepository.list();
  }
}
