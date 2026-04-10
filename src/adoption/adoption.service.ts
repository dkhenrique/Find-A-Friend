import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdoptionEntity } from './adoption.entity';
import { Repository } from 'typeorm';
import { PetEntity } from 'src/pet/pet.entity';
import { UserEntity } from 'src/user/user.entity';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { AdoptionsListDto } from './dto/list-adoptions.dto';
import { PetStatus } from 'src/enums/pet-status.enum';

@Injectable()
export class AdoptionService {
  constructor(
    @InjectRepository(AdoptionEntity)
    private readonly adoptionRepository: Repository<AdoptionEntity>,
    @InjectRepository(PetEntity)
    private readonly petRepository: Repository<PetEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createAdoption(
    dto: CreateAdoptionDto,
    orgId: string,
  ): Promise<AdoptionEntity> {
    const pet = await this.petRepository.findOne({
      where: { id: dto.petId },
      relations: ['user'],
    });
    if (!pet) throw new NotFoundException('Pet não encontrado');

    // Somente a ORG dona do pet pode registrar a adoção
    if (pet.user.id !== orgId) {
      throw new ForbiddenException(
        'Apenas a ORG responsável pelo pet pode registrar a adoção',
      );
    }

    if (pet.status !== PetStatus.AVAILABLE) {
      throw new ConflictException('Este pet não está disponível para adoção');
    }

    const adopter = await this.userRepository.findOneBy({ id: orgId });
    if (!adopter) throw new NotFoundException('ORG não encontrada');

    const adoption = this.adoptionRepository.create({
      pet,
      adopter,
      notes: dto.notes,
    });

    pet.status = PetStatus.ADOPTED;
    await this.petRepository.save(pet);
    return this.adoptionRepository.save(adoption);
  }

  async findAdoptionsByOrg(orgId: string) {
    const savedAdoptions = await this.adoptionRepository.find({
      where: { adopter: { id: orgId } },
      relations: ['pet', 'adopter'],
    });

    return savedAdoptions.map(
      (adoption) =>
        new AdoptionsListDto(
          adoption.id,
          adoption.pet.id,
          adoption.pet.name,
          adoption.adopter.name,
          adoption.pet.status,
        ),
    );
  }

  async findAdoptionById(id: string, orgId: string) {
    const adoption = await this.adoptionRepository.findOne({
      where: { id },
      relations: ['pet', 'pet.user', 'adopter'],
    });
    if (!adoption) throw new NotFoundException('Adoção não encontrada');

    // Somente a ORG que registrou a adoção pode visualizá-la
    if (adoption.adopter.id !== orgId) {
      throw new ForbiddenException(
        'Você não tem permissão para visualizar esta adoção',
      );
    }

    return adoption;
  }

  async cancelAdoption(id: string, orgId: string) {
    const adoption = await this.adoptionRepository.findOne({
      where: { id },
      relations: ['pet', 'adopter'],
    });
    if (!adoption) throw new NotFoundException('Adoção não encontrada');

    // Somente a ORG que registrou a adoção pode cancelá-la
    if (adoption.adopter.id !== orgId) {
      throw new ForbiddenException(
        'Você não tem permissão para cancelar esta adoção',
      );
    }

    adoption.pet.status = PetStatus.AVAILABLE;
    await this.petRepository.save(adoption.pet);
    await this.adoptionRepository.remove(adoption);
  }
}
