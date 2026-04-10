import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateOrg(email: string, password: string): Promise<UserEntity> {
    const org = await this.userService.findByEmail(email);
    if (!org) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, org.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return org;
  }

  async login(org: UserEntity) {
    const payload = { sub: org.id, email: org.email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // Armazenar hash do refresh token no banco
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshToken(org.id, hashedRefreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 3600,
    };
  }

  async refreshToken(refreshTokenValue: string) {
    try {
      const payload = this.jwtService.verify(refreshTokenValue);

      const user = await this.userService.findById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      // Comparar hash armazenado com o token recebido
      const isRefreshTokenValid = await bcrypt.compare(
        refreshTokenValue,
        user.refreshToken,
      );
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      // Gerar novo access_token
      const newPayload = { sub: user.id, email: user.email };
      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: '1h',
      });

      return {
        access_token: newAccessToken,
        expires_in: 3600,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }

  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);
  }
}
