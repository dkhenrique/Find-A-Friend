import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserListDto } from './dto/UserList.dto';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { CreateUserDto } from './dto/CreateUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserListDto> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      zipCode: dto.zipCode,
      whatsapp: dto.whatsapp,
    });

    const saved = await this.userRepository.save(user);
    return new UserListDto(saved.id, saved.name);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { email } });
    return count > 0;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ email });
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
