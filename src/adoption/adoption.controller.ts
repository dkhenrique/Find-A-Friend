import { Body, Controller, Post } from '@nestjs/common';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { AdoptionService } from './adoption.service';

@Controller('adoptions')
export class AdoptionController {
  constructor(private readonly adoptionService: AdoptionService) {}

  @Post()
  async adopt(@Body() dto: CreateAdoptionDto) {
    return await this.adoptionService.createAdoption(dto);
  }
}
