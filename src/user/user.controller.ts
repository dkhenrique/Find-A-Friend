import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);
    return { user, message: 'User created' };
  }

  @Get()
  async listUsers() {
    return this.userService.findAllUsers();
  }

  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    await this.userService.updateUser(id, dto);
    return { message: 'User updated' };
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
    return { message: 'User deleted' };
  }
}
