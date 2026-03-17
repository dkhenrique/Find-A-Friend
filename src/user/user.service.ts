import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserListDto } from './dto/UserList.dto';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(userEntity: UserEntity) {
    await this.userRepository.save(userEntity);
  }

  async findAllUsers() {
    const savedUsers = await this.userRepository.find();
    const listUsers = savedUsers.map(
      (user) => new UserListDto(user.id, user.name),
    );
    return listUsers;
  }

  async updateUser(id: string, userEntity: UpdateUserDto) {
    await this.userRepository.update(id, userEntity);
  }

  async deleteUser(userId: string) {
    await this.userRepository.delete(userId);
  }
}
