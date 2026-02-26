import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { v4 as uuid } from 'uuid';
import { UserListDto } from './dto/UserList.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Controller('/users')
export class UserController {
  constructor(private userRepository: UserRepository) {}

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    const userEntity = new UserEntity();
    userEntity.name = user.name;
    userEntity.email = user.email;
    userEntity.password = user.password;
    userEntity.id = uuid();
    await this.userRepository.create(userEntity);

    return {
      user: new UserListDto(userEntity.id, userEntity.name),
      message: 'User created',
    };
  }

  @Get()
  async listUsers() {
    const savedUsers = await this.userRepository.list();
    const userList = savedUsers.map(
      (user) => new UserListDto(user.id, user.name),
    );
    return userList;
  }

  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() newUser: UpdateUserDto) {
    const userUpdated = await this.userRepository.update(id, newUser);

    return {
      user: new UserListDto(userUpdated.id, userUpdated.name),
      message: 'User updated',
    };
  }
}
