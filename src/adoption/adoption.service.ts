import {
  ConflictException,
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

  async createAdoption(dto: CreateAdoptionDto): Promise<AdoptionEntity> {
    const pet = await this.petRepository.findOneBy({ id: dto.petId });
    if (!pet) throw new NotFoundException('Pet não encontrado');

    if (pet.adotado) throw new ConflictException('Este pet já foi adotado');

    const adopter = await this.userRepository.findOneBy({
      id: dto.adopterId,
    });
    if (!adopter) throw new NotFoundException('Usuário não encontrado');

    const adoption = this.adoptionRepository.create({
      pet,
      adopter,
      notes: dto.notes,
    });

    pet.adotado = true;
    await this.petRepository.save(pet);
    return this.adoptionRepository.save(adoption);
  }

  async findAllAdoptions() {
    const savedAdoptions = await this.adoptionRepository.find({
      relations: ['pet', 'adopter'],
    });
    const adoptionsList = savedAdoptions.map(
      (adoption) =>
        new AdoptionsListDto(
          adoption.id,
          adoption.pet.id,
          adoption.pet.name,
          adoption.adopter.name,
          adoption.pet.adotado,
        ),
    );
    return adoptionsList;
  }

  async findAdoptionById(id: string) {
    const adoption = await this.adoptionRepository.findOne({
      where: { id },
      relations: ['pet', 'adopter'],
    });
    if (!adoption) throw new NotFoundException('Adoção não encontrada');
    return adoption;
  }

  async cancelAdoption(id: string) {
    const adoption = await this.adoptionRepository.findOne({
      where: { id },
      relations: ['pet'],
    });
    if (!adoption) throw new NotFoundException('Adoção não encontrada');

    adoption.pet.adotado = false;
    await this.petRepository.save(adoption.pet);
    await this.adoptionRepository.remove(adoption);
  }
}
