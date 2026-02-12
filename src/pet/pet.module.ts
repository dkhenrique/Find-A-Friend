import { Module } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PetRepository } from './pet.repository';

@Module({
  controllers: [PetController],
  providers: [PetRepository],
})
export class PetModule {}
