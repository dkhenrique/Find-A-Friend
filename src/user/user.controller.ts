import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UserService } from './user.service';

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

  @ApiOperation({ summary: 'Atualizar dados de uma ORG' })
  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    await this.userService.updateUser(id, dto);
    return { message: 'User updated' };
  }

  @ApiOperation({ summary: 'Remover uma ORG' })
  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return { message: 'User deleted' };
  }
}
