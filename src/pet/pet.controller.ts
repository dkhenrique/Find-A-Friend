import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePetDto } from './dto/CreatePet.dto';
import { UpdatePetDto } from './dto/UpdatePet.dto';
import { CreatePetPhotoDto } from './dto/create-pet-photo.dto';
import { CreatePetRequirementDto } from './dto/create-pet-requirement.dto';
import { ListPetsQueryDto } from './dto/list-pets-query.dto';
import { PetService } from './pet.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Pets')
@Controller('/pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @ApiOperation({ summary: 'Cadastrar um pet (requer login)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPet(
    @Body() dto: CreatePetDto,
    @Request() req: { user: { id: string } },
  ) {
    const pet = await this.petService.createPet(dto, req.user.id);
    return { pet, message: 'Pet criado com sucesso' };
  }

  @ApiOperation({ summary: 'Listar pets disponíveis por cidade' })
  @Get()
  listPets(@Query() query: ListPetsQueryDto) {
    return this.petService.findPetsByCity(query);
  }

  @ApiOperation({ summary: 'Visualizar detalhes de um pet' })
  @Get(':id')
  async findPetById(@Param('id') id: string) {
    return this.petService.findPetById(id);
  }

  @ApiOperation({ summary: 'Obter contato WhatsApp da ORG do pet' })
  @Get(':id/contact')
  getContact(@Param('id') id: string) {
    return this.petService.getWhatsAppContact(id);
  }

  @ApiOperation({ summary: 'Atualizar dados de um pet (requer login)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updatePet(@Param('id') id: string, @Body() dto: UpdatePetDto) {
    await this.petService.updatePet(id, dto);
    return { message: 'Pet atualizado' };
  }

  @ApiOperation({ summary: 'Remover um pet (requer login)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deletePet(@Param('id') id: string) {
    await this.petService.deletePet(id);
    return { message: 'Pet removido' };
  }

  // --- Fotos ---

  @ApiOperation({ summary: 'Adicionar foto a um pet (requer login)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':petId/photos')
  async addPhoto(
    @Param('petId') petId: string,
    @Body() dto: CreatePetPhotoDto,
  ) {
    const photo = await this.petService.addPhoto(petId, dto);
    return { photo, message: 'Foto adicionada' };
  }

  @ApiOperation({ summary: 'Remover foto de um pet (requer login)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':petId/photos/:photoId')
  async removePhoto(
    @Param('petId') petId: string,
    @Param('photoId') photoId: string,
  ) {
    await this.petService.removePhoto(petId, photoId);
    return { message: 'Foto removida' };
  }

  // --- Requisitos ---

  @ApiOperation({ summary: 'Adicionar requisito a um pet (requer login)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':petId/requirements')
  async addRequirement(
    @Param('petId') petId: string,
    @Body() dto: CreatePetRequirementDto,
  ) {
    const requirement = await this.petService.addRequirement(petId, dto);
    return { requirement, message: 'Requisito adicionado' };
  }

  @ApiOperation({ summary: 'Remover requisito de um pet (requer login)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':petId/requirements/:requirementId')
  async removeRequirement(
    @Param('petId') petId: string,
    @Param('requirementId') requirementId: string,
  ) {
    await this.petService.removeRequirement(petId, requirementId);
    return { message: 'Requisito removido' };
  }
}
