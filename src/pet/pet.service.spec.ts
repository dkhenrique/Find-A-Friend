import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetEntity } from './pet.entity';
import { PetPhotoEntity } from './pet-photo.entity';
import { PetRequirementEntity } from './pet-requirement.entity';
import { UserEntity } from '../user/user.entity';
import { PetEnum } from '../enums/petEnum';
import { PetAge } from '../enums/pet-age.enum';
import { PetSize } from '../enums/pet-size.enum';
import { PetStatus } from '../enums/pet-status.enum';

// Helper factories
const makeOrg = (overrides: Partial<UserEntity> = {}): UserEntity =>
  ({
    id: 'org-uuid-1',
    name: 'ORG Test',
    email: 'org@test.com',
    password: 'hashed',
    address: 'Rua teste',
    city: 'Campinas',
    state: 'SP',
    zipCode: '13000000',
    whatsapp: '5519999990000',
    refreshToken: null,
    pets: [],
    adoptions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null as unknown as Date,
  }) as UserEntity;

const makePet = (overrides: Partial<PetEntity> = {}): PetEntity =>
  ({
    id: 'pet-uuid-1',
    name: 'Rex',
    especie: PetEnum.DOG,
    age: PetAge.ADULTO,
    size: PetSize.MEDIO,
    status: PetStatus.AVAILABLE,
    description: 'Um bom pet',
    user: makeOrg(),
    photos: [],
    requirements: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null as unknown as Date,
    ...overrides,
  }) as unknown as PetEntity;

describe('PetService', () => {
  let service: PetService;

  // Mock repositories
  const mockPetRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };
  const mockPhotoRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };
  const mockRequirementRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };
  const mockUserRepo = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetService,
        { provide: getRepositoryToken(PetEntity), useValue: mockPetRepo },
        { provide: getRepositoryToken(PetPhotoEntity), useValue: mockPhotoRepo },
        {
          provide: getRepositoryToken(PetRequirementEntity),
          useValue: mockRequirementRepo,
        },
        { provide: getRepositoryToken(UserEntity), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<PetService>(PetService);
    jest.clearAllMocks();
  });

  // ─── createPet ──────────────────────────────────────

  describe('createPet', () => {
    const dto = {
      name: 'Rex',
      especie: PetEnum.DOG,
      age: PetAge.ADULTO,
      size: PetSize.MEDIO,
    };

    it('deve criar um pet com sucesso', async () => {
      const org = makeOrg();
      const savedPet = makePet({ user: org });

      mockUserRepo.findOneBy.mockResolvedValue(org);
      mockPetRepo.create.mockReturnValue(savedPet);
      mockPetRepo.save.mockResolvedValue(savedPet);

      const result = await service.createPet(dto, org.id);

      expect(result.id).toBe(savedPet.id);
      expect(result.name).toBe('Rex');
      expect(result.status).toBe(PetStatus.AVAILABLE);
      expect(mockPetRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: PetStatus.AVAILABLE }),
      );
    });

    it('deve lançar 404 se ORG não existir', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(null);

      await expect(service.createPet(dto, 'non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── findPetsByCity ─────────────────────────────────

  describe('findPetsByCity', () => {
    const mockQb = {
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    };

    beforeEach(() => {
      mockPetRepo.createQueryBuilder.mockReturnValue(mockQb);
    });

    it('deve retornar pets filtrados por cidade com paginação', async () => {
      const pets = [makePet(), makePet({ id: 'pet-uuid-2', name: 'Luna' })];
      mockQb.getManyAndCount.mockResolvedValue([pets, 2]);

      const result = await service.findPetsByCity({
        city: 'Campinas',
        page: 1,
        limit: 20,
      });

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it('deve retornar lista vazia se não houver pets na cidade', async () => {
      mockQb.getManyAndCount.mockResolvedValue([[], 0]);

      const result = await service.findPetsByCity({
        city: 'CidadeInexistente',
        page: 1,
        limit: 20,
      });

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });

    it('deve paginar corretamente', async () => {
      mockQb.getManyAndCount.mockResolvedValue([[], 25]);

      const result = await service.findPetsByCity({
        city: 'Campinas',
        page: 3,
        limit: 10,
      });

      expect(mockQb.skip).toHaveBeenCalledWith(20); // (3-1) * 10
      expect(mockQb.take).toHaveBeenCalledWith(10);
      expect(result.meta.totalPages).toBe(3); // ceil(25/10)
    });
  });

  // ─── findPetById ────────────────────────────────────

  describe('findPetById', () => {
    it('deve retornar pet com dados da ORG (sem password)', async () => {
      const pet = makePet();
      mockPetRepo.findOne.mockResolvedValue(pet);

      const result = await service.findPetById('pet-uuid-1');

      expect(result.id).toBe('pet-uuid-1');
      expect((result as Record<string, unknown>).user).toBeDefined();
      expect(
        (result.user as Record<string, unknown>).password,
      ).toBeUndefined();
    });

    it('deve lançar 404 se pet não existir', async () => {
      mockPetRepo.findOne.mockResolvedValue(null);

      await expect(service.findPetById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── updatePet ──────────────────────────────────────

  describe('updatePet', () => {
    it('deve atualizar pet com sucesso', async () => {
      const pet = makePet();
      mockPetRepo.findOne.mockResolvedValue(pet);
      mockPetRepo.update.mockResolvedValue({ affected: 1 });

      await service.updatePet('pet-uuid-1', { name: 'Rex Updated' }, 'org-uuid-1');

      expect(mockPetRepo.update).toHaveBeenCalledWith('pet-uuid-1', {
        name: 'Rex Updated',
      });
    });

    it('deve lançar 403 se ORG não for dona do pet', async () => {
      const pet = makePet();
      mockPetRepo.findOne.mockResolvedValue(pet);

      await expect(
        service.updatePet('pet-uuid-1', { name: 'Hack' }, 'other-org-id'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('deve lançar 404 se pet não existir', async () => {
      mockPetRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updatePet('non-existent', { name: 'X' }, 'org-uuid-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── deletePet ──────────────────────────────────────

  describe('deletePet', () => {
    it('deve soft-deletar pet com sucesso', async () => {
      const pet = makePet();
      mockPetRepo.findOne.mockResolvedValue(pet);
      mockPetRepo.softDelete.mockResolvedValue({ affected: 1 });

      await service.deletePet('pet-uuid-1', 'org-uuid-1');

      expect(mockPetRepo.softDelete).toHaveBeenCalledWith('pet-uuid-1');
    });

    it('deve lançar 403 se ORG não for dona do pet', async () => {
      const pet = makePet();
      mockPetRepo.findOne.mockResolvedValue(pet);

      await expect(
        service.deletePet('pet-uuid-1', 'other-org-id'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
