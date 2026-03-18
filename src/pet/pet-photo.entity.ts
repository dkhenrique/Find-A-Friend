import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PetEntity } from './pet.entity';

@Entity({ name: 'pet_photos' })
export class PetPhotoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'Url', length: 255, nullable: false })
  url: string;

  @Column({ name: 'description', length: 200, nullable: true })
  description: string;

  @ManyToOne(() => PetEntity, (pet) => pet.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pet_id' })
  pet: PetEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
