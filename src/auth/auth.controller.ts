import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserEntity } from 'src/user/user.entity';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login de uma ORG (retorna JWT)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'org@email.com' },
        password: { type: 'string', example: '123456' },
      },
      required: ['email', 'password'],
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: { user: UserEntity }) {
    return this.authService.login(req.user);
  }
}
