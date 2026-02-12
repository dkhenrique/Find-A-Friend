import { Body, Controller, Get, Post } from '@nestjs/common';

import { UserRepository } from 'src/repositories/user.repository';

@Controller('/users')
export class UserController {
  constructor(private userRepository: UserRepository) {}

  @Post()
  async createUser(@Body() body: any) {
    await this.userRepository.create(body);
    return { message: 'User created' };
  }

  @Get()
  async listUsers() {
    return this.userRepository.list();
  }
}
