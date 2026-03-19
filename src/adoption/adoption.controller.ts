import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { AdoptionService } from './adoption.service';

@Controller('adoptions')
export class AdoptionController {
  constructor(private readonly adoptionService: AdoptionService) {}

  @Post()
  async adopt(@Body() dto: CreateAdoptionDto) {
    return await this.adoptionService.createAdoption(dto);
  }

  @Get()
  async findAllAdoptions() {
    return await this.adoptionService.findAllAdoptions();
  }

  @Get(':id')
  async findAdoptionById(@Param('id') id: string) {
    return await this.adoptionService.findAdoptionById(id);
  }

  @Delete(':id')
  async cancelAdoption(@Param('id') id: string) {
    await this.adoptionService.cancelAdoption(id);
    return { message: 'Adoção cancelada com sucesso' };
  }
}
