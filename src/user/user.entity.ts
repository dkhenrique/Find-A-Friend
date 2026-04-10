import { AdoptionEntity } from 'src/adoption/adoption.entity';
import { PetEntity } from 'src/pet/pet.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@Index('IDX_users_city', ['city'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', length: 100, nullable: false })
  name: string;

  @Column({ name: 'email', length: 70, nullable: false })
  email: string;

  @Column({ name: 'password', length: 255, nullable: false })
  password: string;

  @Column({ name: 'address', length: 255, nullable: false })
  address: string;

  @Column({ name: 'city', length: 100, nullable: false })
  city: string;

  @Column({ name: 'state', length: 2, nullable: false })
  state: string;

  @Column({ name: 'zip_code', length: 10, nullable: false })
  zipCode: string;

  @Column({ name: 'whatsapp', length: 20, nullable: false })
  whatsapp: string;

  @Column({ name: 'refresh_token', length: 255, nullable: true })
  refreshToken: string | null;

  @OneToMany(() => PetEntity, (pet) => pet.user, {
    cascade: ['insert', 'update'],
  })
  pets: PetEntity[];

  @OneToMany(() => AdoptionEntity, (adoption) => adoption.adopter)
  adoptions: AdoptionEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
