import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('ORGs (Organizações)')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Cadastrar uma nova ORG' })
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);
    return { user, message: 'User created' };
  }

  @ApiOperation({ summary: 'Listar todas as ORGs' })
  @Get()
  async listUsers() {
    return this.userService.findAllUsers();
  }

  @ApiOperation({ summary: 'Visualizar detalhes de uma ORG' })
  @Get('/:id')
  async findUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findUserById(id);
  }

  @ApiOperation({ summary: 'Atualizar dados de uma ORG (requer login)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @Request() req: { user: { id: string } },
  ) {
    if (req.user.id !== id) {
      throw new ForbiddenException(
        'You can only modify your own account',
      );
    }

    await this.userService.updateUser(id, dto);
    return { message: 'User updated' };
  }

  @ApiOperation({ summary: 'Remover uma ORG (requer login)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { id: string } },
  ) {
    if (req.user.id !== id) {
      throw new ForbiddenException(
        'You can only delete your own account',
      );
    }

    await this.userService.deleteUser(id);
    return { message: 'User deleted' };
  }
}
