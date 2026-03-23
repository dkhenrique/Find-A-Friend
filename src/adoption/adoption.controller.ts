import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { AdoptionService } from './adoption.service';

@ApiTags('Adoções')
@Controller('adoptions')
export class AdoptionController {
  constructor(private readonly adoptionService: AdoptionService) {}

  @ApiOperation({ summary: 'Registrar uma adoção' })
  @Post()
  async adopt(@Body() dto: CreateAdoptionDto) {
    return await this.adoptionService.createAdoption(dto);
  }

  @ApiOperation({ summary: 'Listar todas as adoções' })
  @Get()
  async findAllAdoptions() {
    return await this.adoptionService.findAllAdoptions();
  }

  @ApiOperation({ summary: 'Buscar adoção por ID' })
  @Get(':id')
  async findAdoptionById(@Param('id') id: string) {
    return await this.adoptionService.findAdoptionById(id);
  }

  @ApiOperation({ summary: 'Cancelar uma adoção' })
  @Delete(':id')
  async cancelAdoption(@Param('id') id: string) {
    await this.adoptionService.cancelAdoption(id);
    return { message: 'Adoção cancelada com sucesso' };
  }
}
