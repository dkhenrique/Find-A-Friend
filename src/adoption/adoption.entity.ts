import { PetEntity } from 'src/pet/pet.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'adoptions' })
export class AdoptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.adoptions)
  @JoinColumn({ name: 'adopter_id' })
  adopter: UserEntity;

  @ManyToOne(() => PetEntity, (pet) => pet.adoption)
  @JoinColumn({ name: 'pet_id' })
  pet: PetEntity;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'adopted_at' })
  adoptedAt: Date;
}
