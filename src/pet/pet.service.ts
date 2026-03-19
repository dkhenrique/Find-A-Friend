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

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(PetEntity)
    private readonly petRepository: Repository<PetEntity>,
    @InjectRepository(PetPhotoEntity)
    private readonly photoRepository: Repository<PetPhotoEntity>,
    @InjectRepository(PetRequirementEntity)
    private readonly requirementRepository: Repository<PetRequirementEntity>,
  ) {}

  async createPet(dto: CreatePetDto): Promise<PetListDto> {
    const pet = this.petRepository.create(dto);
    const saved = await this.petRepository.save(pet);
    return new PetListDto(saved.id, saved.name, saved.especie, saved.adotado);
  }

  async findAllPets() {
    const savedPets = await this.petRepository.find();
    const petList = savedPets.map(
      (pet) => new PetListDto(pet.id, pet.name, pet.especie, pet.adotado),
    );
    return petList;
  }

  async findPetById(id: string) {
    const pet = await this.petRepository.findOne({
      where: { id },
      relations: ['photos', 'requirements'],
    });
    if (!pet) throw new NotFoundException('Pet não encontrado');
    return pet;
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
