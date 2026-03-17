import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { v4 as uuid } from 'uuid';
import { UserListDto } from './dto/UserList.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
  ) {}

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    const userEntity = new UserEntity();
    userEntity.name = user.name;
    userEntity.email = user.email;
    userEntity.password = user.password;
    userEntity.id = uuid();
    await this.userService.createUser(userEntity);

    return {
      user: new UserListDto(userEntity.id, userEntity.name),
      message: 'User created',
    };
  }

  @Get()
  async listUsers() {
    const savedUsers = await this.userService.findAllUsers();
    return savedUsers;
  }

  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() newUser: UpdateUserDto) {
    const userUpdated = await this.userService.updateUser(id, newUser);

    return {
      user: userUpdated,
      message: 'User updated',
    };
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    const userDeleted = await this.userService.deleteUser(id);

    return {
      user: userDeleted,
      message: 'User deleted',
    };
  }
}
