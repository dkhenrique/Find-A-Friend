import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PetEntity } from './pet.entity';

@Entity({ name: 'pet_requirements' })
export class PetRequirementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', length: 100, nullable: false })
  title: string;

  @ManyToMany(() => PetEntity, (pet) => pet.requirements)
  pets: PetEntity[];
}
