import { Body, Controller, Get, Post } from '@nestjs/common';
import { User, UserRepository } from './user.repository';

@Controller('/users')
export class UserController {
  constructor(private userRepository: UserRepository) {}

  @Post()
  async createUser(@Body() body: User) {
    await this.userRepository.create(body);
    return { message: 'User created' };
  }

  @Get()
  async listUsers() {
    return this.userRepository.list();
  }
}
