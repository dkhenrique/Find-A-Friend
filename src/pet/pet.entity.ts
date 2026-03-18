import { PetEnum } from 'src/enums/petEnum';
import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PetPhotoEntity } from './pet-photo.entity';
import { AdoptionEntity } from 'src/adoption/adoption.entity';
import { PetRequirementEntity } from './pet-requirement.entity';

@Entity({ name: 'pets' })
export class PetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', length: 100, nullable: false })
  name: string;

  @Column({ name: 'especie', enum: PetEnum, nullable: false })
  especie: PetEnum;

  @Column({ name: 'adotado', nullable: false })
  adotado: boolean;

  @ManyToOne(() => UserEntity, (user) => user.pets)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => PetPhotoEntity, (photo) => photo.pet, {
    cascade: ['insert', 'soft-remove'],
  })
  photos: PetPhotoEntity[];

  @OneToOne(() => AdoptionEntity, (adoption) => adoption.pet)
  adoption: AdoptionEntity;

  @ManyToMany(() => PetRequirementEntity, (requirement) => requirement.pets, {
    cascade: ['insert'],
  })
  requirements: PetRequirementEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
