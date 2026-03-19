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
import { CreatePetPhotoDto } from './dto/create-pet-photo.dto';
import { CreatePetRequirementDto } from './dto/create-pet-requirement.dto';
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

  @Get(':id')
  async findPetById(@Param('id') id: string) {
    return this.petService.findPetById(id);
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

  // --- Fotos ---

  @Post(':petId/photos')
  async addPhoto(
    @Param('petId') petId: string,
    @Body() dto: CreatePetPhotoDto,
  ) {
    const photo = await this.petService.addPhoto(petId, dto);
    return { photo, message: 'Foto adicionada' };
  }

  @Delete(':petId/photos/:photoId')
  async removePhoto(
    @Param('petId') petId: string,
    @Param('photoId') photoId: string,
  ) {
    await this.petService.removePhoto(petId, photoId);
    return { message: 'Foto removida' };
  }

  // --- Requisitos ---

  @Post(':petId/requirements')
  async addRequirement(
    @Param('petId') petId: string,
    @Body() dto: CreatePetRequirementDto,
  ) {
    const requirement = await this.petService.addRequirement(petId, dto);
    return { requirement, message: 'Requisito adicionado' };
  }

  @Delete(':petId/requirements/:requirementId')
  async removeRequirement(
    @Param('petId') petId: string,
    @Param('requirementId') requirementId: string,
  ) {
    await this.petService.removeRequirement(petId, requirementId);
    return { message: 'Requisito removido' };
  }
}
