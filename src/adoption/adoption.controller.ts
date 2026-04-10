import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { AdoptionService } from './adoption.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Adoções')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('adoptions')
export class AdoptionController {
  constructor(private readonly adoptionService: AdoptionService) {}

  @ApiOperation({ summary: 'Registrar uma adoção (requer login)' })
  @Post()
  async adopt(
    @Body() dto: CreateAdoptionDto,
    @Request() req: { user: { id: string } },
  ) {
    return await this.adoptionService.createAdoption(dto, req.user.id);
  }

  @ApiOperation({ summary: 'Listar adoções da ORG logada (requer login)' })
  @Get()
  async findAllAdoptions(@Request() req: { user: { id: string } }) {
    return await this.adoptionService.findAdoptionsByOrg(req.user.id);
  }

  @ApiOperation({ summary: 'Buscar adoção por ID (requer login)' })
  @Get(':id')
  async findAdoptionById(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { id: string } },
  ) {
    return await this.adoptionService.findAdoptionById(id, req.user.id);
  }

  @ApiOperation({ summary: 'Cancelar uma adoção (requer login)' })
  @Delete(':id')
  async cancelAdoption(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.adoptionService.cancelAdoption(id, req.user.id);
    return { message: 'Adoção cancelada com sucesso' };
  }
}
