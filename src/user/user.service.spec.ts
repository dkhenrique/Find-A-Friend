import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/CreateUser.dto';

jest.mock('bcrypt');

const makeUser = (overrides: Partial<UserEntity> = {}): UserEntity =>
  ({
    id: 'user-uuid-1',
    name: 'ORG Test',
    email: 'org@test.com',
    password: 'hashedpassword',
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
    ...overrides,
  }) as UserEntity;

describe('UserService', () => {
  let service: UserService;

  const mockUserRepo = {
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(UserEntity), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('deve criar e salvar um novo usuário com senha sendo hashed', async () => {
      const dto: CreateUserDto = {
        name: 'ORG Test',
        email: 'org@test.com',
        password: 'securepwd',
        address: 'Rua',
        city: 'City',
        state: 'SP',
        zipCode: '12345678',
        whatsapp: '1234567890',
      };
      const savedUser = makeUser();

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      mockUserRepo.create.mockReturnValue(savedUser);
      mockUserRepo.save.mockResolvedValue(savedUser);

      const result = await service.createUser(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith('securepwd', 10);
      expect(mockUserRepo.create).toHaveBeenCalled();
      expect(mockUserRepo.save).toHaveBeenCalled();
      expect(result.id).toBe(savedUser.id);
      expect(result.name).toBe(savedUser.name);
    });
  });

  describe('existsByEmail', () => {
    it('deve retornar true se email existe', async () => {
      mockUserRepo.count.mockResolvedValue(1);
      const result = await service.existsByEmail('org@test.com');
      expect(result).toBe(true);
      expect(mockUserRepo.count).toHaveBeenCalledWith({ where: { email: 'org@test.com' } });
    });

    it('deve retornar false se email não existe', async () => {
      mockUserRepo.count.mockResolvedValue(0);
      const result = await service.existsByEmail('non@test.com');
      expect(result).toBe(false);
    });
  });

  describe('findByEmail', () => {
    it('deve retornar usuário pelo email', async () => {
      const user = makeUser();
      mockUserRepo.findOneBy.mockResolvedValue(user);
      const result = await service.findByEmail('org@test.com');
      expect(result).toEqual(user);
    });
  });

  describe('findAllUsers', () => {
    it('deve retornar lista de UserListDto', async () => {
      const users = [makeUser(), makeUser({ id: 'uuid-2', name: 'Another ORG' })];
      mockUserRepo.find.mockResolvedValue(users);

      const result = await service.findAllUsers();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('user-uuid-1');
      expect(result[1].name).toBe('Another ORG');
    });
  });

  describe('findUserById', () => {
    it('deve retornar public properties de user se encontrado', async () => {
      const user = makeUser();
      mockUserRepo.findOneBy.mockResolvedValue(user);

      const result = await service.findUserById('user-uuid-1');
      expect(result.id).toBe('user-uuid-1');
      expect((result as any).password).toBeUndefined(); // never expose
    });

    it('deve jogar NotFoundException se não existir', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findUserById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('deve executar update no DB', async () => {
      mockUserRepo.update.mockResolvedValue({ affected: 1 });
      await service.updateUser('user-uuid-1', { name: 'New Name' });
      expect(mockUserRepo.update).toHaveBeenCalledWith('user-uuid-1', { name: 'New Name' });
    });
  });

  describe('updateRefreshToken', () => {
    it('deve executar update do refreshToken no DB', async () => {
      mockUserRepo.update.mockResolvedValue({ affected: 1 });
      await service.updateRefreshToken('user-uuid-1', 'somerandomhashtoken');
      expect(mockUserRepo.update).toHaveBeenCalledWith('user-uuid-1', { refreshToken: 'somerandomhashtoken' });
    });
  });

  describe('findById', () => {
    it('deve pesquisar diretamente e retornar UserEntity completo', async () => {
      const user = makeUser();
      mockUserRepo.findOneBy.mockResolvedValue(user);
      const result = await service.findById('123');
      expect(result).toBe(user);
    });
  });

  describe('deleteUser', () => {
    it('deve softDelete o usuario do banco', async () => {
      mockUserRepo.softDelete.mockResolvedValue({ affected: 1 });
      await service.deleteUser('user-uuid-1');
      expect(mockUserRepo.softDelete).toHaveBeenCalledWith('user-uuid-1');
    });
  });
});
