import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

// Factory helpers
const makeOrg = (overrides: Partial<UserEntity> = {}): UserEntity =>
  ({
    id: 'org-uuid-1',
    name: 'ORG Test',
    email: 'org@test.com',
    password: 'hashed-pass',
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

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    updateRefreshToken: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  // ─── validateOrg ────────────────────────────────────

  describe('validateOrg', () => {
    it('deve validar credenciais e retornar o usuário', async () => {
      const hashedPassword = await bcrypt.hash('senha123', 10);
      const org = makeOrg({ password: hashedPassword });
      mockUserService.findByEmail.mockResolvedValue(org);

      const result = await service.validateOrg('org@test.com', 'senha123');

      expect(result.id).toBe(org.id);
      expect(result.email).toBe(org.email);
    });

    it('deve lançar UnauthorizedException se email não existir', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(
        service.validateOrg('fake@test.com', 'senha123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException se senha for inválida', async () => {
      const hashedPassword = await bcrypt.hash('senha123', 10);
      const org = makeOrg({ password: hashedPassword });
      mockUserService.findByEmail.mockResolvedValue(org);

      await expect(
        service.validateOrg('org@test.com', 'senhaerrada'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── login ──────────────────────────────────────────

  describe('login', () => {
    it('deve gerar access e refresh tokens', async () => {
      const org = makeOrg();
      mockJwtService.sign
        .mockReturnValueOnce('fake-access-token')
        .mockReturnValueOnce('fake-refresh-token');
      mockUserService.updateRefreshToken.mockResolvedValue(undefined);

      const result = await service.login(org);

      expect(result.access_token).toBe('fake-access-token');
      expect(result.refresh_token).toBe('fake-refresh-token');
      expect(result.expires_in).toBe(3600);
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockUserService.updateRefreshToken).toHaveBeenCalledWith(
        org.id,
        expect.any(String), // hashed refresh token
      );
    });
  });

  // ─── refreshToken ───────────────────────────────────

  describe('refreshToken', () => {
    it('deve renovar access token com refresh válido', async () => {
      const refreshTokenValue = 'valid-refresh-token';
      const hashedRefresh = await bcrypt.hash(refreshTokenValue, 10);
      const org = makeOrg({ refreshToken: hashedRefresh });

      mockJwtService.verify.mockReturnValue({
        sub: org.id,
        email: org.email,
      });
      mockUserService.findById.mockResolvedValue(org);
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refreshToken(refreshTokenValue);

      expect(result.access_token).toBe('new-access-token');
      expect(result.expires_in).toBe(3600);
    });

    it('deve lançar UnauthorizedException com refresh token inválido (JWT inválido)', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('invalid token');
      });

      await expect(
        service.refreshToken('invalid-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException se usuário não tiver refresh token salvo', async () => {
      const org = makeOrg({ refreshToken: null });
      mockJwtService.verify.mockReturnValue({
        sub: org.id,
        email: org.email,
      });
      mockUserService.findById.mockResolvedValue(org);

      await expect(
        service.refreshToken('some-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException se hash do refresh não bater', async () => {
      const org = makeOrg({
        refreshToken: await bcrypt.hash('outro-token', 10),
      });
      mockJwtService.verify.mockReturnValue({
        sub: org.id,
        email: org.email,
      });
      mockUserService.findById.mockResolvedValue(org);

      await expect(
        service.refreshToken('token-diferente'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── logout ─────────────────────────────────────────

  describe('logout', () => {
    it('deve limpar refresh token do usuário', async () => {
      mockUserService.updateRefreshToken.mockResolvedValue(undefined);

      await service.logout('org-uuid-1');

      expect(mockUserService.updateRefreshToken).toHaveBeenCalledWith(
        'org-uuid-1',
        null,
      );
    });
  });
});
