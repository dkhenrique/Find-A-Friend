import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePetDto } from './dto/CreatePet.dto';
import { UpdatePetDto } from './dto/UpdatePet.dto';
import { PetService } from './pet.service';

@Controller('/pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  async createPet(@Body() dto: CreatePetDto) {
    const pet = await this.petService.createPet(dto);
    return { pet, message: 'Pet created' };
  }

  @Get()
  async listPets() {
    return this.petService.findAllPets();
  }

  @Put('/:id')
  async updatePet(@Param('id') id: string, @Body() dto: UpdatePetDto) {
    await this.petService.updatePet(id, dto);
    return { message: 'Pet updated' };
  }

  @Delete('/:id')
  async deletePet(@Param('id') id: string) {
    await this.petService.deletePet(id);
    return { message: 'Pet deleted' };
  }
}
