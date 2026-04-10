import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { AdoptionService } from './adoption.service';
import { AdoptionEntity } from './adoption.entity';
import { PetEntity } from '../pet/pet.entity';
import { UserEntity } from '../user/user.entity';
import { PetStatus } from '../enums/pet-status.enum';

const makeUser = (id = 'org-uuid-1', name = 'ORG 1'): UserEntity =>
  ({
    id,
    name,
    email: 'org@test.com',
    password: 'hashed',
    address: 'Rua',
    city: 'Campinas',
    state: 'SP',
    zipCode: '13000',
    whatsapp: '1234',
    refreshToken: null,
    pets: [],
    adoptions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null as unknown as Date,
  }) as UserEntity;

const makePet = (
  id = 'pet-uuid-1',
  status = PetStatus.AVAILABLE,
  ownerId = 'org-uuid-1',
): PetEntity =>
  ({
    id,
    name: 'Rex',
    status,
    user: makeUser(ownerId),
    photos: [],
    requirements: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null as unknown as Date,
  }) as unknown as PetEntity;

const makeAdoption = (id = 'ado-uuid-1', adopterId = 'org-uuid-1'): AdoptionEntity =>
  ({
    id,
    notes: 'Anotações',
    adopter: makeUser(adopterId),
    pet: makePet('pet-uuid-1', PetStatus.ADOPTED, adopterId),
    adoptedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }) as AdoptionEntity;

describe('AdoptionService', () => {
  let service: AdoptionService;

  const mockAdoptionRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockPetRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepo = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdoptionService,
        {
          provide: getRepositoryToken(AdoptionEntity),
          useValue: mockAdoptionRepo,
        },
        { provide: getRepositoryToken(PetEntity), useValue: mockPetRepo },
        { provide: getRepositoryToken(UserEntity), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<AdoptionService>(AdoptionService);
    jest.clearAllMocks();
  });

  describe('createAdoption', () => {
    it('deve criar adoção se status for AVAILABLE e as ORGs forem iguais', async () => {
      const org = makeUser('org-uuid-1');
      const pet = makePet('pet-uuid-1', PetStatus.AVAILABLE, 'org-uuid-1');
      const adoption = makeAdoption('ado-uuid-1', 'org-uuid-1');

      mockPetRepo.findOne.mockResolvedValue(pet);
      mockUserRepo.findOneBy.mockResolvedValue(org);
      mockAdoptionRepo.create.mockReturnValue(adoption);
      mockAdoptionRepo.save.mockResolvedValue(adoption);
      mockPetRepo.save.mockResolvedValue(pet);

      const result = await service.createAdoption({ petId: 'pet-uuid-1', notes: 'notas' }, 'org-uuid-1');

      expect(result.id).toBe('ado-uuid-1');
      expect(pet.status).toBe(PetStatus.ADOPTED);
      expect(mockPetRepo.save).toHaveBeenCalledWith(pet);
      expect(mockAdoptionRepo.save).toHaveBeenCalledWith(adoption);
    });

    it('deve lançar ForbiddenException se ORG não for dona do pet', async () => {
      const pet = makePet('pet-uuid-1', PetStatus.AVAILABLE, 'other-org');
      mockPetRepo.findOne.mockResolvedValue(pet);

      await expect(service.createAdoption({ petId: 'pet-uuid-1', notes: 'notas' }, 'org-uuid-1')).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar ConflictException se pet não estiver AVAILABLE', async () => {
      const pet = makePet('pet-uuid-1', PetStatus.ADOPTED, 'org-uuid-1');
      mockPetRepo.findOne.mockResolvedValue(pet);

      await expect(service.createAdoption({ petId: 'pet-uuid-1', notes: 'notas' }, 'org-uuid-1')).rejects.toThrow(ConflictException);
    });

    it('deve lançar NotFoundException se pet não for encontrado', async () => {
      mockPetRepo.findOne.mockResolvedValue(null);
      await expect(service.createAdoption({ petId: 'pet-uuid-1', notes: 'notas' }, 'org-uuid-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAdoptionsByOrg', () => {
    it('deve retornar a lista envelopada de adoções da ORG', async () => {
      const adoption = makeAdoption('ado-uuid-1', 'org-uuid-1');
      mockAdoptionRepo.find.mockResolvedValue([adoption]);

      const result = await service.findAdoptionsByOrg('org-uuid-1');
      expect(result).toHaveLength(1);
      expect(result[0].adoptionId).toBe('ado-uuid-1');
    });
  });

  describe('findAdoptionById', () => {
    it('deve retornar adoção se ORG logada for a adopter', async () => {
      const adoption = makeAdoption('ado-uuid-1', 'org-uuid-1');
      mockAdoptionRepo.findOne.mockResolvedValue(adoption);

      const result = await service.findAdoptionById('ado-uuid-1', 'org-uuid-1');
      expect(result.id).toBe('ado-uuid-1');
    });

    it('deve lançar ForbiddenException se ORG não for a adopter', async () => {
      const adoption = makeAdoption('ado-uuid-1', 'other-org');
      mockAdoptionRepo.findOne.mockResolvedValue(adoption);

      await expect(service.findAdoptionById('ado-uuid-1', 'org-uuid-1')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('cancelAdoption', () => {
    it('deve remover adoção e resetar status do pet', async () => {
      const adoption = makeAdoption('ado-uuid-1', 'org-uuid-1');
      mockAdoptionRepo.findOne.mockResolvedValue(adoption);

      await service.cancelAdoption('ado-uuid-1', 'org-uuid-1');

      expect(adoption.pet.status).toBe(PetStatus.AVAILABLE);
      expect(mockPetRepo.save).toHaveBeenCalledWith(adoption.pet);
      expect(mockAdoptionRepo.remove).toHaveBeenCalledWith(adoption);
    });

    it('deve lançar ForbiddenException se ORG tentar cancelar adoção de outro', async () => {
      const adoption = makeAdoption('ado-uuid-1', 'other-org');
      mockAdoptionRepo.findOne.mockResolvedValue(adoption);

      await expect(service.cancelAdoption('ado-uuid-1', 'org-uuid-1')).rejects.toThrow(ForbiddenException);
    });
  });
});
