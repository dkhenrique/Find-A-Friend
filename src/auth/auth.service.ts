import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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

  login(org: UserEntity) {
    const payload = { sub: org.id, email: org.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
