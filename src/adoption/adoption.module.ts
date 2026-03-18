import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionEntity } from './adoption.entity';
import { PetEntity } from 'src/pet/pet.entity';
import { UserEntity } from 'src/user/user.entity';
import { AdoptionController } from './adoption.controller';
import { AdoptionService } from './adoption.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdoptionEntity, PetEntity, UserEntity])],
  controllers: [AdoptionController],
  providers: [AdoptionService],
})
export class AdoptionModule {}
