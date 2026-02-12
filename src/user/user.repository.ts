import { Injectable } from '@nestjs/common';

export interface User {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UserRepository {
  private users: User[] = [];

  async create(user: User) {
    await this.users.push(user);
  }

  async list() {
    return await this.users;
  }
}