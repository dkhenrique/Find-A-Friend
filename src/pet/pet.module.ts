import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetController } from './pet.controller';
import { PetEntity } from './pet.entity';
import { PetPhotoEntity } from './pet-photo.entity';
import { PetRequirementEntity } from './pet-requirement.entity';
import { PetService } from './pet.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PetEntity, PetPhotoEntity, PetRequirementEntity]),
  ],
  controllers: [PetController],
  providers: [PetService],
})
export class PetModule {}
