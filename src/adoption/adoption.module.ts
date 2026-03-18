import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionEntity } from './adoption.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdoptionEntity])],
})
export class AdoptionModule {}
