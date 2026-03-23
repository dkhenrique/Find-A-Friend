import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PetEntity } from './pet.entity';
import { Repository } from 'typeorm';
import { PetListDto } from './dto/PetList.dto';
import { UpdatePetDto } from './dto/UpdatePet.dto';
import { CreatePetDto } from './dto/CreatePet.dto';
import { PetPhotoEntity } from './pet-photo.entity';
import { PetRequirementEntity } from './pet-requirement.entity';
import { CreatePetPhotoDto } from './dto/create-pet-photo.dto';
import { CreatePetRequirementDto } from './dto/create-pet-requirement.dto';
import { ListPetsQueryDto } from './dto/list-pets-query.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(PetEntity)
    private readonly petRepository: Repository<PetEntity>,
    @InjectRepository(PetPhotoEntity)
    private readonly photoRepository: Repository<PetPhotoEntity>,
    @InjectRepository(PetRequirementEntity)
    private readonly requirementRepository: Repository<PetRequirementEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createPet(dto: CreatePetDto, orgId: string): Promise<PetListDto> {
    const org = await this.userRepository.findOneBy({ id: orgId });
    if (!org) throw new NotFoundException('ORG não encontrada');

    const pet = this.petRepository.create({
      ...dto,
      adotado: false,
      user: org,
    });

    const saved = await this.petRepository.save(pet);
    return new PetListDto(saved.id, saved.name, saved.especie, saved.adotado);
  }

  async findPetsByCity(query: ListPetsQueryDto) {
    const qb = this.petRepository
      .createQueryBuilder('pet')
      .innerJoinAndSelect('pet.user', 'org')
      .leftJoinAndSelect('pet.photos', 'photos')
      .where('org.city = :city', { city: query.city })
      .andWhere('pet.adotado = :adotado', { adotado: false });

    if (query.age) {
      qb.andWhere('pet.age = :age', { age: query.age });
    }
    if (query.size) {
      qb.andWhere('pet.size = :size', { size: query.size });
    }
    if (query.energyLevel) {
      qb.andWhere('pet.energyLevel = :energyLevel', {
        energyLevel: query.energyLevel,
      });
    }
    if (query.independenceLevel) {
      qb.andWhere('pet.independenceLevel = :independenceLevel', {
        independenceLevel: query.independenceLevel,
      });
    }
    if (query.environment) {
      qb.andWhere('pet.environment = :environment', {
        environment: query.environment,
      });
    }
    if (query.especie) {
      qb.andWhere('pet.especie = :especie', { especie: query.especie });
    }

    return qb.getMany();
  }

  async findPetById(id: string) {
    const pet = await this.petRepository.findOne({
      where: { id },
      relations: ['photos', 'requirements', 'user'],
    });
    if (!pet) throw new NotFoundException('Pet não encontrado');

    // Remove dados sensíveis da ORG na resposta
    const orgData = { ...pet.user } as Partial<UserEntity>;
    delete orgData.password;
    return {
      ...pet,
      user: orgData,
    };
  }

  async getWhatsAppContact(petId: string) {
    const pet = await this.petRepository.findOne({
      where: { id: petId },
      relations: ['user'],
    });
    if (!pet) throw new NotFoundException('Pet não encontrado');

    const whatsapp = pet.user.whatsapp;
    const message = encodeURIComponent(
      `Olá! Tenho interesse em adotar o(a) ${pet.name}.`,
    );

    return {
      orgName: pet.user.name,
      whatsapp,
      whatsappUrl: `https://wa.me/${whatsapp}?text=${message}`,
    };
  }

  async updatePet(id: string, petEntity: UpdatePetDto) {
    await this.petRepository.update(id, petEntity);
  }

  async deletePet(id: string) {
    await this.petRepository.delete(id);
  }

  // --- Fotos ---

  async addPhoto(petId: string, dto: CreatePetPhotoDto) {
    const pet = await this.petRepository.findOneBy({ id: petId });
    if (!pet) throw new NotFoundException('Pet não encontrado');

    const photo = this.photoRepository.create({
      url: dto.url,
      description: dto.description,
      pet,
    });
    return this.photoRepository.save(photo);
  }

  async removePhoto(petId: string, photoId: string) {
    const photo = await this.photoRepository.findOne({
      where: { id: photoId, pet: { id: petId } },
    });
    if (!photo) throw new NotFoundException('Foto não encontrada');
    await this.photoRepository.remove(photo);
  }

  // --- Requisitos ---

  async addRequirement(petId: string, dto: CreatePetRequirementDto) {
    const pet = await this.petRepository.findOne({
      where: { id: petId },
      relations: ['requirements'],
    });
    if (!pet) throw new NotFoundException('Pet não encontrado');

    let requirement = await this.requirementRepository.findOneBy({
      title: dto.title,
    });

    if (!requirement) {
      requirement = this.requirementRepository.create({ title: dto.title });
      requirement = await this.requirementRepository.save(requirement);
    }

    pet.requirements.push(requirement);
    await this.petRepository.save(pet);
    return requirement;
  }

  async removeRequirement(petId: string, requirementId: string) {
    const pet = await this.petRepository.findOne({
      where: { id: petId },
      relations: ['requirements'],
    });
    if (!pet) throw new NotFoundException('Pet não encontrado');

    pet.requirements = pet.requirements.filter((r) => r.id !== requirementId);
    await this.petRepository.save(pet);
  }
}
